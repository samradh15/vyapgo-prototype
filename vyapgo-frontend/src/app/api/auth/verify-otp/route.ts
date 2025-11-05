// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";

const isBuildPhase =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

/**
 * ✅ Next.js 15 requirement:
 *   - only async function exports
 *   - no top-level imports that run code at build time
 *   - dynamic imports for Twilio & Firebase admin
 */
export async function POST(req: Request) {
  if (isBuildPhase) {
    console.log("⚙️  Skipping verify route during Vercel build...");
    return NextResponse.json(
      { ok: true, message: "Firebase/Twilio verify skipped during build" },
      { status: 200 },
    );
  }

  // Runtime only — dynamically import heavy server modules
  const twilio = (await import("twilio")).default;
  const { adminAuth } = await import("@/lib/firebase-admin");

  const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
  const authToken = process.env.TWILIO_AUTH_TOKEN || "";
  const verifySid = process.env.TWILIO_VERIFY_SID || "";

  const assertTwilioEnv = () => {
    if (!/^AC[a-f0-9]{32}$/i.test(accountSid)) {
      throw new Error("TWILIO_ACCOUNT_SID must look like ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    }
    if (!authToken) {
      throw new Error("TWILIO_AUTH_TOKEN is missing");
    }
    if (!/^VA[a-f0-9]{32}$/i.test(verifySid)) {
      throw new Error("TWILIO_VERIFY_SID must look like VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    }
  };

  try {
    assertTwilioEnv();

    const { phone, code } = await req.json();
    if (!/^\+\d{6,15}$/.test(phone) || !/^\d{4,8}$/.test(code)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const client = twilio(accountSid, authToken);

    const check = await client.verify.v2.services(verifySid).verificationChecks.create({
      to: phone,
      code,
    });

    if (check.status !== "approved") {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // ✅ Firebase user handling
    let uid: string;
    let isNewUser = false;
    try {
      const existing = await adminAuth.getUserByPhoneNumber(phone);
      uid = existing.uid;
    } catch (err: any) {
      if (
        err?.code === "auth/user-not-found" ||
        err?.errorInfo?.code === "auth/user-not-found"
      ) {
        const created = await adminAuth.createUser({ phoneNumber: phone });
        uid = created.uid;
        isNewUser = true;
      } else {
        throw err;
      }
    }

    const customToken = await adminAuth.createCustomToken(uid, {
      phoneVerified: true,
    });

    return NextResponse.json({ customToken, isNewUser });
  } catch (e: any) {
    const more = e?.moreInfo ? ` (${e.moreInfo})` : "";
    return NextResponse.json(
      { error: e?.message ? `Twilio: ${e.message}${more}` : "Verification failed" },
      { status: 500 },
    );
  }
}
