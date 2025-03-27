import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { UserSessionInput, UserSessionPayload } from "./session.type";
import { cookies } from "next/headers";
import { Result } from "@/types";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);
const sessionExp = Number(process.env.SESSION_EXP) || 60 * 60 * 24 * 7 * 1000;

export async function encrypt(payload: UserSessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    console.error(e);
    // throw e;
  }
}

export async function getSession(): Promise<Result<UserSessionPayload, Error>> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) {
    return {
      success: false,
      error: new Error("session not found"),
    };
  }
  const payload = await decrypt(session.value);

  if (!payload) {
    return {
      success: false,
      error: new Error("session not found"),
    };
  }

  return {
    success: true,
    data: payload as UserSessionPayload,
  };
}

export async function createSession(payload: UserSessionInput) {
  const expiresAt = new Date(Date.now() + sessionExp);
  const session = await encrypt({
    ...payload,
    expiresAt,
  });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
