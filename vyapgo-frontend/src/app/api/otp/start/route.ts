// src/app/api/otp/start/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

const hash = (s: string) => crypto.createHash("sha256").update(s).digest("hex");
const randomCode = () => Math.floor(100000 + Math.random() * 900000).toString();
const isBuildPhase =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

/**
 * ✅ Only async export — Next.js 15 compatible
 */
export async function POST(req: Request) {
  // 🧱 Skip firebase-admin during build
  if (isBuildPhase) {
    console.log("⚙️ Skipping OTP start route during Vercel build...");
    return NextResponse.json({
      ok: true,
      message: "Skipped during build (safe deploy)",
    });
  }

  // 🧩 Runtime-only imports
  const { getFirestore } = await import("firebase-admin/firestore");
  await import("@/lib/firebase-admin");

  const db = getFirestore();

  async function sendSms(to: string, text: string) {
    const provider = process.env.SMS_PROVIDER || "console";

    if (provider === "console") {
      console.log("[SMS:DEV]", to, text);
      return;
    }

    // Placeholder for Twilio/MSG91 logic (optional)
  }

  try {
    const { phone } = await req.json();
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      return NextResponse.json(
        { ok: false, message: "Invalid phone" },
        { status: 400 }
      );
    }

    const ref = db.collection("otpChallenges").doc(phone);
    const existing = await ref.get();
    if (existing.exists) {
      const d = existing.data()!;
      if (Date.now() < (d.expiresAt ?? 0)) {
        return NextResponse.json({ ok: true });
      }
    }

    const code = randomCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    await ref.set({
      codeHash: hash(code),
      expiresAt,
      attempts: 0,
      createdAt: Date.now(),
    });

    await sendSms(phone, `Your VyapGO code is ${code}`);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: e?.message || "Failed to start OTP" },
      { status: 500 }
    );
  }
}
