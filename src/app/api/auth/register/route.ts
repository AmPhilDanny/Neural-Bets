import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sessionId = Math.random().toString(36).substring(2, 15);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        activeSessionId: sessionId
      },
    });

    await login({ id: user.id, email: user.email, tier: user.tier, sessionId });

    return NextResponse.json({ success: true, user: { email: user.email, tier: user.tier } });
  } catch (e: any) {
    console.error("Registration Error:", e.message, e.stack);
    return NextResponse.json({ error: 'Internal Server Error', details: e.message }, { status: 500 });
  }

}
