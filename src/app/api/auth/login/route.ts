import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Single Device Control: Generate new sessionId and store it
    // This will invalidate any other active sessions
    const sessionId = Math.random().toString(36).substring(2, 15);
    await prisma.user.update({
      where: { id: user.id },
      data: { activeSessionId: sessionId, lastLoginAt: new Date() }
    });

    await login({ id: user.id, email: user.email, tier: user.tier, sessionId });

    return NextResponse.json({ success: true, user: { email: user.email, tier: user.tier } });
  } catch (e: any) {
    console.error("Login Error:", e.message, e.stack);
    return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
  }

}
