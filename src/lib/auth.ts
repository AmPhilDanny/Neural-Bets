import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = "neural_bets_secret_key_change_this_in_prod";
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload;
}

import { prisma } from '@/lib/prisma';

export async function login(user: { id: string; email: string; tier: string; sessionId: string }) {
  // Create the session
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  (await cookies()).set('session', session, { expires, httpOnly: true, secure: true });
}

export async function logout() {
  // Destroy the session
  (await cookies()).set('session', '', { expires: new Date(0) });
}


export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  
  try {
    const parsed = await decrypt(sessionCookie);
    if (!parsed || !parsed.user) return null;

    // Strict one-device check: verify sessionId against DB
    const user = await prisma.user.findUnique({
      where: { id: parsed.user.id },
      select: { activeSessionId: true, tier: true }
    });

    if (!user || user.activeSessionId !== parsed.user.sessionId) {
      return null; // Session invalidated or session mismatch
    }

    // Sync latest tier
    parsed.user.tier = user.tier;
    
    return parsed;
  } catch (e) {
    return null;
  }
}


export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}
