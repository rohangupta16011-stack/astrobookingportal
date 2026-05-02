import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export const runtime = "nodejs";

const PRICES: Record<string, number> = {
  "30 minutes": 1600,
  "60 minutes": 3200,
};

export async function POST(req: NextRequest) {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay credentials not configured." },
      { status: 500 }
    );
  }

  let body: { duration?: string; fullName?: string; email?: string; mobile?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const duration = body.duration ?? "";
  const amount = PRICES[duration];
  if (!amount) {
    return NextResponse.json(
      { error: "Invalid consultation duration." },
      { status: 400 }
    );
  }

  const rp = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await rp.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `booking_${Date.now()}`,
      notes: {
        fullName: body.fullName ?? "",
        email: body.email ?? "",
        mobile: body.mobile ?? "",
        duration,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order." },
      { status: 502 }
    );
  }
}
