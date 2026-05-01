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

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
