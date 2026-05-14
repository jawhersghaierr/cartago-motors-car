import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ||
    "AutoExport-maghreb-secret-key-2024-change-in-production",
);

export interface AdminPayload {
  id: number;
  username: string;
  name: string;
  email: string;
}

export async function signToken(payload: AdminPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<AdminPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminFromRequest(
  request: NextRequest,
): Promise<AdminPayload | null> {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function getAdminFromCookies(): Promise<AdminPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
