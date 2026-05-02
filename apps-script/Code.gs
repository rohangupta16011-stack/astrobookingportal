/**
 * Google Apps Script webhook for the Consultation Booking Form (Razorpay version).
 *
 * Receives JSON payloads from /api/submit AFTER Razorpay payment succeeds and
 * the signature is verified server-side. On every booking it:
 *   1. Writes a row to Google Sheets
 *   2. Creates a Google Calendar event on the owner's calendar with a Google
 *      Meet link, invites the customer
 *   3. Emails both the customer (with Meet link + calendar invite) and the owner
 *
 * Setup:
 *   1. In the Apps Script editor, click "Services" (+ icon in left sidebar)
 *      and add "Google Calendar API" (identifier: Calendar). This enables the
 *      advanced Calendar service used for Meet link generation.
 *   2. Save and deploy: Deploy -> Manage deployments -> pencil -> New version.
 *   3. On first run after deploy, authorize the new Calendar permissions.
 */

const SPREADSHEET_ID = "1SL1Oi_4rTieE6DOgS6XqJ5UERZ55wc5iJDonTfHl6_4";
const SHEET_NAME = "Astro Bookings";
const OWNER_EMAIL = "astroanikita@gmail.com";
const BUSINESS_NAME = "Astro Anikita";
const TIMEZONE = "Asia/Kolkata";

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
  "Meet Link",
  "Calendar Event ID",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    let meetUrl = "";
    let eventId = "";
    try {
      const created = createMeetingEvent(data);
      meetUrl = created.meetUrl;
      eventId = created.eventId;
    } catch (calErr) {
      Logger.log("Calendar/Meet creation failed: " + calErr);
    }

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
      meetUrl,
      eventId,
    ]);

    try {
      sendNotifications(data, meetUrl);
    } catch (mailErr) {
      Logger.log("Email send failed: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, meetUrl: meetUrl }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function createMeetingEvent(data) {
  const start = parseConsultationDateTime(data.consultationDate, data.consultationTime);
  const durationMins = parseInt(String(data.consultationDuration), 10) || 30;
  const end = new Date(start.getTime() + durationMins * 60 * 1000);

  const event = {
    summary: BUSINESS_NAME + " consultation - " + data.fullName,
    description:
      "Consultation Type: " + data.consultationType + "\n" +
      "Duration: " + data.consultationDuration + "\n" +
      "Mobile (WhatsApp): " + data.mobile + "\n" +
      "Email: " + data.email + "\n\n" +
      "Birth details:\n" +
      "  DOB: " + data.dob + "\n" +
      "  Time of Birth: " + data.timeOfBirth + "\n" +
      "  Place: " + data.placeOfBirth + "\n" +
      "  Gender: " + data.gender + "\n\n" +
      "Payment ID: " + data.paymentId,
    start: { dateTime: start.toISOString(), timeZone: TIMEZONE },
    end: { dateTime: end.toISOString(), timeZone: TIMEZONE },
    attendees: data.email ? [{ email: data.email }, { email: OWNER_EMAIL }] : [{ email: OWNER_EMAIL }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 60 },
        { method: "popup", minutes: 15 },
      ],
    },
    conferenceData: {
      createRequest: {
        requestId: data.paymentId || ("astro_" + Date.now()),
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  const created = Calendar.Events.insert(event, "primary", {
    conferenceDataVersion: 1,
    sendUpdates: "all",
  });

  let meetUrl = created.hangoutLink || "";
  if (!meetUrl && created.conferenceData && created.conferenceData.entryPoints) {
    const entry = created.conferenceData.entryPoints.find(function (ep) {
      return ep.entryPointType === "video";
    });
    if (entry) meetUrl = entry.uri;
  }

  return { meetUrl: meetUrl, eventId: created.id || "" };
}

function parseConsultationDateTime(dateStr, timeStr) {
  // dateStr: "yyyy-MM-dd"  timeStr: "HH:MM AM/PM"
  const dParts = String(dateStr).split("-").map(Number);
  if (dParts.length !== 3) throw new Error("Invalid date: " + dateStr);
  const year = dParts[0], month = dParts[1], day = dParts[2];

  const m = String(timeStr).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) throw new Error("Invalid time: " + timeStr);
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  // Build ISO with IST offset (+05:30) so the resulting Date is correct UTC
  const pad = function (n) { return String(n).padStart(2, "0"); };
  const iso = year + "-" + pad(month) + "-" + pad(day) + "T" + pad(hour) + ":" + pad(minute) + ":00+05:30";
  return new Date(iso);
}

function sendNotifications(data, meetUrl) {
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
    .map(function (kv) {
      return '<tr><td style="padding:8px 14px;border:1px solid #f0e4c4;background:#fffcf1;font-weight:600;color:#2B1810;">' +
        kv[0] +
        '</td><td style="padding:8px 14px;border:1px solid #f0e4c4;color:#2B1810;">' +
        escapeHtml(kv[1]) +
        '</td></tr>';
    })
    .join("");

  const baseTable =
    '<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">' +
    tableRows +
    "</table>";

  const meetBlock = meetUrl
    ? '<div style="margin:24px 0;padding:18px 22px;background:#fffcf1;border:1px solid #f5b700;border-radius:14px;">' +
      '<p style="margin:0 0 6px 0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#8A7560;">Your session link</p>' +
      '<a href="' + meetUrl + '" style="display:inline-block;color:#C99000;font-weight:700;font-size:18px;text-decoration:none;">' +
      meetUrl + ' &rarr;</a>' +
      '<p style="margin:8px 0 0 0;font-size:12px;color:#8A7560;">A calendar invite has also been sent to your email.</p>' +
      '</div>'
    : '<p style="margin-top:16px;color:#8A7560;">You will receive the Google Meet link on WhatsApp before your scheduled session.</p>';

  // 1. Confirmation email to the customer
  const submitterSubject = BUSINESS_NAME + " - Your booking is confirmed";
  const submitterHtml =
    '<div style="font-family:Arial,sans-serif;color:#2B1810;max-width:600px;">' +
    '<h2 style="color:#C99000;margin-bottom:8px;">Thank you, ' + escapeHtml(data.fullName) + ' &#10024;</h2>' +
    '<p style="font-size:15px;">Your payment has been received and your consultation slot is confirmed.</p>' +
    meetBlock +
    '<h3 style="color:#2B1810;margin-top:24px;">Your booking</h3>' +
    baseTable +
    '<p style="color:#8A7560;font-size:12px;margin-top:24px;">If anything looks incorrect, just reply to this email.</p>' +
    '</div>';
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
    "New paid booking - " + data.fullName +
    " (" + data.consultationType + ", " + data.consultationDuration + ") - " + formattedAmount;
  const dashboardLink = "https://dashboard.razorpay.com/app/payments/" + encodeURIComponent(data.paymentId);
  const ownerMeetLine = meetUrl
    ? '<p style="margin-top:16px;"><strong>Meet link:</strong> <a href="' + meetUrl + '" style="color:#C99000;">' + meetUrl + '</a></p>'
    : '';
  const ownerHtml =
    '<div style="font-family:Arial,sans-serif;color:#2B1810;max-width:600px;">' +
    '<h2 style="color:#C99000;">New consultation booking received</h2>' +
    baseTable +
    ownerMeetLine +
    '<p style="margin-top:24px;">' +
    '<a href="' + dashboardLink + '" style="color:#C99000;font-weight:600;">View payment in Razorpay dashboard &rarr;</a>' +
    '</p>' +
    '</div>';
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
