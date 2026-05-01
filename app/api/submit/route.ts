import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "SHEETS_WEBHOOK_URL is not configured." },
      { status: 500 }
    );
  }

  const incoming = await req.formData();
  const file = incoming.get("paymentScreenshot");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Missing payment screenshot." },
      { status: 400 }
    );
  }

  const arrayBuf = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuf).toString("base64");

  const payload = {
    fullName: String(incoming.get("fullName") ?? ""),
    mobile: String(incoming.get("mobile") ?? ""),
    email: String(incoming.get("email") ?? ""),
    dob: String(incoming.get("dob") ?? ""),
    timeOfBirth: String(incoming.get("timeOfBirth") ?? ""),
    placeOfBirth: String(incoming.get("placeOfBirth") ?? ""),
    gender: String(incoming.get("gender") ?? ""),
    consultationType: String(incoming.get("consultationType") ?? ""),
    consultationDuration: String(incoming.get("consultationDuration") ?? ""),
    consultationDate: String(incoming.get("consultationDate") ?? ""),
    consultationTime: String(incoming.get("consultationTime") ?? ""),
    submittedAt: new Date().toISOString(),
    file: {
      name: file.name,
      mimeType: file.type || "image/jpeg",
      data: base64,
    },
  };

  const upstream = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!upstream.ok) {
    const text = await upstream.text();
    return NextResponse.json(
      { error: `Sheets webhook error: ${text}` },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
