/**
 * Google Apps Script webhook for the Consultation Booking Form.
 *
 * Setup:
 *   1. Create a new Google Sheet. Note its spreadsheet ID (the long
 *      string in the URL between /d/ and /edit).
 *   2. Create a Google Drive folder where the payment screenshots
 *      should be saved. Note its folder ID (the part after /folders/
 *      in the URL).
 *   3. Open script.google.com -> New project -> paste this file.
 *   4. Replace SPREADSHEET_ID and DRIVE_FOLDER_ID below.
 *   5. Deploy -> New deployment -> Type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Copy the Web app URL.
 *   6. In Vercel, set the env var SHEETS_WEBHOOK_URL to that URL.
 */

const SPREADSHEET_ID = "1SL1Oi_4rTieE6DOgS6XqJ5UERZ55wc5iJDonTfHl6_4";
const DRIVE_FOLDER_ID = "1chpbWw5X9bCG5PuTOzpWuOepU1a-f2a9";
const SHEET_NAME = "Astro Bookings";
const OWNER_EMAIL = "astroanikita@gmail.com";
const BUSINESS_NAME = "Astro Anikita";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const blob = Utilities.newBlob(
      Utilities.base64Decode(data.file.data),
      data.file.mimeType,
      `${Date.now()}_${data.file.name}`
    );
    const driveFile = folder.createFile(blob);
    driveFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const fileUrl = driveFile.getUrl();

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
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
        "Payment Screenshot",
      ]);
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
      fileUrl,
    ]);

    try {
      sendNotifications(data, fileUrl);
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

function sendNotifications(data, fileUrl) {
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
  ];

  const tableRows = summaryRows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e0e0e0;background:#f7f6fb;font-weight:600;">${k}</td><td style="padding:6px 12px;border:1px solid #e0e0e0;">${escapeHtml(v)}</td></tr>`
    )
    .join("");

  const baseTable = `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">${tableRows}</table>`;

  // 1. Email to the submitter (confirmation)
  const submitterSubject = `${BUSINESS_NAME} - Booking received`;
  const submitterHtml = `
    <div style="font-family:Arial,sans-serif;color:#202124;max-width:600px;">
      <h2 style="color:#673AB7;">Thank you, ${escapeHtml(data.fullName)}!</h2>
      <p>We've received your consultation booking. Here is a copy of the details you submitted:</p>
      ${baseTable}
      <p style="margin-top:20px;">We will reach out on your WhatsApp number to confirm the slot.</p>
      <p style="color:#5F6368;font-size:12px;margin-top:24px;">If anything looks incorrect, just reply to this email.</p>
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

  // 2. Email to the owner (admin alert) with screenshot link
  const ownerSubject = `New booking - ${data.fullName} (${data.consultationType}, ${data.consultationDuration})`;
  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;color:#202124;max-width:600px;">
      <h2 style="color:#673AB7;">New consultation booking</h2>
      ${baseTable}
      <p style="margin-top:20px;">
        <a href="${fileUrl}" style="color:#673AB7;">View payment screenshot</a>
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
