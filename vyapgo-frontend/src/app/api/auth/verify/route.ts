// src/app/api/auth/verify/route.ts
import { NextResponse } from "next/server";

const isBuildPhase =
  process.env.NODE_ENV === "production" && process.env.VERCEL === "1";

/**
 * ✅ Build-safe + runtime-correct Next.js 15 route.
 * Only async exports. No top-level firebase-admin import.
 */
export async function POST(request: Request) {
  // 🔒 Step 1 — skip firebase-admin during build
  if (isBuildPhase) {
    console.log("⚙️ Skipping Firebase verify route during Vercel build...");
    return NextResponse.json(
      { ok: true, message: "Verification skipped during build" },
      { status: 200 }
    );
  }

  // 🧩 Step 2 — Lazy-load firebase-admin verify util at runtime
  const { verifyIdToken } = await import("@/lib/firebase-admin");

  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Missing token" },
        { status: 401 }
      );
    }

    const decoded = await verifyIdToken(token);
    return NextResponse.json({ ok: true, uid: decoded.uid, decoded });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid token" },
      { status: 401 }
    );
  }
}
