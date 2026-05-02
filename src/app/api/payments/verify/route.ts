import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/payments';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { reference } = await request.json();
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const verificationData = await verifyPayment(reference);

    if (verificationData.status && verificationData.data.status === 'success') {
      const { amount, metadata } = verificationData.data;
      const { tier, duration, userId } = metadata;

      // Calculate expiration date
      let expires = new Date();
      if (duration === 'DAILY') expires.setDate(expires.getDate() + 1);
      else if (duration === 'WEEKLY') expires.setDate(expires.getDate() + 7);
      else if (duration === 'MONTHLY') expires.setMonth(expires.getMonth() + 1);
      else if (duration === 'YEARLY') expires.setFullYear(expires.getFullYear() + 1);

      // Add 1-day grace period for expiration logic
      // Note: We check if expiration + 1 day > now

      // Update user subscription
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: tier,
          subscriptionEnds: expires
        }
      });

      // Create transaction record
      await prisma.transaction.create({
        data: {
          userId,
          amount: amount / 100, // Convert kobo back to NGN
          reference,
          status: 'SUCCESS',
          type: 'SUBSCRIPTION',
          tier,
          duration,
          paymentMethod: 'PAYSTACK'
        }
      });

      return NextResponse.json({ success: true, message: 'Subscription upgraded' });
    } else {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
