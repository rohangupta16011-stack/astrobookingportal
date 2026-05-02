import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const runtime = "nodejs";
export const maxDuration = 30;

type Payload = {
  fullName: string;
  mobile: string;
  email: string;
  dob: string;
  timeOfBirth: string;
  placeOfBirth: string;
  gender: string;
  consultationType: string;
  consultationDuration: string;
  consultationDate: string;
  consultationTime: string;
  amount: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function verifySignature(orderId: string, paymentId: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.SHEETS_WEBHOOK_URL;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "SHEETS_WEBHOOK_URL is not configured." },
      { status: 500 }
    );
  }
  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials not configured." },
      { status: 500 }
    );
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!body.razorpay_order_id || !body.razorpay_payment_id || !body.razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment confirmation." },
      { status: 400 }
    );
  }

  const valid = verifySignature(
    body.razorpay_order_id,
    body.razorpay_payment_id,
    body.razorpay_signature,
    keySecret
  );
  if (!valid) {
    return NextResponse.json(
      { error: "Payment signature verification failed." },
      { status: 400 }
    );
  }

  const payload = {
    fullName: body.fullName,
    mobile: body.mobile,
    email: body.email,
    dob: body.dob,
    timeOfBirth: body.timeOfBirth,
    placeOfBirth: body.placeOfBirth,
    gender: body.gender,
    consultationType: body.consultationType,
    consultationDuration: body.consultationDuration,
    consultationDate: body.consultationDate,
    consultationTime: body.consultationTime,
    amount: body.amount,
    paymentId: body.razorpay_payment_id,
    orderId: body.razorpay_order_id,
    paymentStatus: "Paid",
    submittedAt: new Date().toISOString(),
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
