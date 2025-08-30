import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Déconnecté" });
  res.cookies.set({
    name: "admin_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
    maxAge: 0, // expire immediately
  });
  return res;
}

