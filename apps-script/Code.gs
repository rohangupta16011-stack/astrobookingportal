/**
 * Google Apps Script webhook for the Consultation Booking Form (Razorpay version).
 *
 * Receives JSON payloads from /api/submit AFTER Razorpay payment succeeds and
 * the signature is verified server-side. Writes to Google Sheets and emails
 * both the customer and the owner.
 *
 * Setup:
 *   1. Open the Apps Script project linked to your Vercel SHEETS_WEBHOOK_URL.
 *   2. Replace SPREADSHEET_ID below if you want to point to a different sheet.
 *      The script will create a new tab named SHEET_NAME on first run.
 *   3. Save and deploy: Deploy -> Manage deployments -> pencil -> New version.
 */

const SPREADSHEET_ID = "1SL1Oi_4rTieE6DOgS6XqJ5UERZ55wc5iJDonTfHl6_4";
const SHEET_NAME = "Astro Bookings";
const OWNER_EMAIL = "astroanikita@gmail.com";
const BUSINESS_NAME = "Astro Anikita";

const COLUMNS = [
  "Submitted At",
  "Full Name",
  "Mobile",
  "Email",
  "Date of Birth",
  "Time of Birth",
  "Place of Birth",
  "Gender",
  "Consultation Type",
  "Consultation Duration",
  "Consultation Date",
  "Consultation Time",
  "Amount (INR)",
  "Payment ID",
  "Order ID",
  "Payment Status",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    } else if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight("bold");
    }

    sheet.appendRow([
      data.submittedAt,
      data.fullName,
      data.mobile,
      data.email,
      data.dob,
      data.timeOfBirth,
      data.placeOfBirth,
      data.gender,
      data.consultationType,
      data.consultationDuration,
      data.consultationDate,
      data.consultationTime,
      data.amount,
      data.paymentId,
      data.orderId,
      data.paymentStatus || "Paid",
    ]);

    try {
      sendNotifications(data);
    } catch (mailErr) {
      Logger.log("Email send failed: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNotifications(data) {
  const formattedAmount = "INR " + Number(data.amount).toLocaleString("en-IN");

  const summaryRows = [
    ["Full Name", data.fullName],
    ["Mobile (WhatsApp)", data.mobile],
    ["Email", data.email],
    ["Date of Birth", data.dob],
    ["Time of Birth", data.timeOfBirth],
    ["Place of Birth", data.placeOfBirth],
    ["Gender", data.gender],
    ["Consultation Type", data.consultationType],
    ["Consultation Duration", data.consultationDuration],
    ["Consultation Date", data.consultationDate],
    ["Consultation Time", data.consultationTime],
    ["Amount Paid", formattedAmount],
    ["Payment ID", data.paymentId],
  ];

  const tableRows = summaryRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 14px;border:1px solid #f0e4c4;background:#fffcf1;font-weight:600;color:#2B1810;">${k}</td><td style="padding:8px 14px;border:1px solid #f0e4c4;color:#2B1810;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const baseTable = `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">${tableRows}</table>`;

  // 1. Confirmation email to the customer
  const submitterSubject = `${BUSINESS_NAME} - Your booking is confirmed`;
  const submitterHtml = `
    <div style="font-family:Arial,sans-serif;color:#2B1810;max-width:600px;">
      <h2 style="color:#C99000;margin-bottom:8px;">Thank you, ${escapeHtml(data.fullName)} ✦</h2>
      <p style="font-size:15px;">Your payment has been received and your consultation slot is confirmed.</p>
      <h3 style="color:#2B1810;margin-top:24px;">Your booking</h3>
      ${baseTable}
      <p style="margin-top:24px;">You will receive the Google Meet link on WhatsApp before your scheduled session.</p>
      <p style="color:#8A7560;font-size:12px;margin-top:24px;">If anything looks incorrect, just reply to this email.</p>
    </div>
  `;
  if (data.email) {
    MailApp.sendEmail({
      to: data.email,
      subject: submitterSubject,
      htmlBody: submitterHtml,
      name: BUSINESS_NAME,
    });
  }

  // 2. Owner alert
  const ownerSubject =
    "New paid booking - " +
    data.fullName +
    " (" +
    data.consultationType +
    ", " +
    data.consultationDuration +
    ") - " +
    formattedAmount;
  const dashboardLink = "https://dashboard.razorpay.com/app/payments/" + encodeURIComponent(data.paymentId);
  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;color:#2B1810;max-width:600px;">
      <h2 style="color:#C99000;">New consultation booking received</h2>
      ${baseTable}
      <p style="margin-top:24px;">
        <a href="${dashboardLink}" style="color:#C99000;font-weight:600;">View payment in Razorpay dashboard →</a>
      </p>
    </div>
  `;
  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: ownerSubject,
    htmlBody: ownerHtml,
    name: BUSINESS_NAME,
    replyTo: data.email || undefined,
  });
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
