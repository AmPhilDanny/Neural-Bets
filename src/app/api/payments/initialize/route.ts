import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { paystack } from '@/lib/paystack';
import { prisma } from '@/lib/prisma';

const PRICES = {
  PREMIUM_DAILY: 1000,
  PREMIUM_WEEKLY: 5000,
  PREMIUM_MONTHLY: 15000,
  VIP_DAILY: 2500,
  VIP_WEEKLY: 10000,
  VIP_MONTHLY: 30000,
};

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { tier, duration } = await request.json();
    const planKey = `${tier}_${duration}`.toUpperCase();
    const amount = PRICES[planKey as keyof typeof PRICES];

    if (!amount) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const metadata = {
      userId: session.user.id,
      tier,
      duration,
    };

    const result = await paystack.initializeTransaction(
      session.user.email,
      amount,
      metadata
    );

    if (result.status) {
      // Create a pending transaction in our DB
      await prisma.transaction.create({
        data: {
          userId: session.user.id,
          amount,
          reference: result.data.reference,
          status: 'PENDING',
          type: 'SUBSCRIPTION',
          tier: tier as any,
          duration,
          paymentMethod: 'PAYSTACK',
        }
      });

      return NextResponse.json({ url: result.data.authorization_url });
    } else {
      return NextResponse.json({ error: 'Payment initialization failed' }, { status: 500 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
