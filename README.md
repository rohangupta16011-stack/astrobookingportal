# Consultation Booking Portal

A Vercel-hosted Next.js replica of the Google Form at https://consultingform.short.gy/Swv1hu. Submissions are written to a Google Sheet via a Google Apps Script webhook, with the payment screenshot uploaded to a Google Drive folder.

## Local development

```bash
npm install
cp .env.local.example .env.local
# Edit .env.local and set SHEETS_WEBHOOK_URL
npm run dev
```

Visit http://localhost:3000.

## Google Sheets webhook setup

1. Create a new Google Sheet. Copy its **spreadsheet ID** (the long string in the URL between `/d/` and `/edit`).
2. Create a Google Drive folder for payment screenshots. Copy its **folder ID** (the part after `/folders/` in the URL).
3. Go to https://script.google.com -> **New project**.
4. Delete the placeholder code, paste the contents of [apps-script/Code.gs](apps-script/Code.gs), and update `SPREADSHEET_ID` and `DRIVE_FOLDER_ID`.
5. Click **Deploy** -> **New deployment** -> select type **Web app**:
   - Description: `Consultation form webhook`
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Authorize when prompted. Copy the **Web app URL** at the end.
7. Add it as an env var in Vercel (and `.env.local` for local dev): `SHEETS_WEBHOOK_URL=<that URL>`.

## Deploy to Vercel

```bash
npm install -g vercel
vercel            # follow prompts; pick "Next.js"
vercel env add SHEETS_WEBHOOK_URL   # paste the Apps Script web app URL
vercel --prod
```

Vercel will give you a `*.vercel.app` URL.

## Field list

| # | Field | Required |
|---|---|---|
| 1 | Full Name | Yes |
| 2 | Mobile Number (Whatsapp Number) | Yes |
| 3 | Email Address | Yes |
| 4 | Date of Birth | Yes |
| 5 | Time of Birth | Yes |
| 6 | Place of Birth | Yes |
| 7 | Gender (Male / Female) | Yes |
| 8 | Consultation Type (Astrology / Numerology / Both / Follow-up Consulation) | Yes |
| 9 | Consultation Duration (30 / 60 minutes) | Yes |
| 10 | Payment screenshot upload (image, max 10 MB) | Yes |
| 11 | Consultation Date | Yes |
| 12 | Consultation Time | Yes |

The QR image is embedded from `public/payment-qr.png`.
