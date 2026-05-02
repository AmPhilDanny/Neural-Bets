import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    if (!signature) return NextResponse.json({}, { status: 400 });

    // Verify signature
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === 'charge.success') {
      const { reference, metadata } = event.data;
      const { userId, tier, duration } = metadata;

      // Calculate expiry date
      let days = 1;
      if (duration === 'WEEKLY') days = 7;
      if (duration === 'MONTHLY') days = 30;
      if (duration === 'YEARLY') days = 365;

      const subscriptionEnds = new Date();
      subscriptionEnds.setDate(subscriptionEnds.getDate() + days);

      // Update Transaction and User in a transaction
      await prisma.$transaction([
        prisma.transaction.update({
          where: { reference },
          data: { status: 'SUCCESS' }
        }),
        prisma.user.update({
          where: { id: userId },
          data: {
            tier: tier as any,
            subscriptionEnds
          }
        })
      ]);

      console.log(`Successfully upgraded user ${userId} to ${tier} for ${duration}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
