import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  // Simple protection with a CRON_SECRET env variable
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    // Allow 1 day grace period as per requirement: 
    // "TERMINATE USERS WHO DONT RENEW AFTER 1 DAY OF EXPERATION"
    const graceDate = new Date();
    graceDate.setDate(graceDate.getDate() - 1);

    const expiredUsers = await prisma.user.updateMany({
      where: {
        tier: { not: 'FREE' },
        subscriptionEnds: { lt: graceDate }
      },
      data: {
        tier: 'FREE',
        subscriptionEnds: null
      }
    });

    return NextResponse.json({ 
      success: true, 
      count: expiredUsers.count,
      message: `${expiredUsers.count} expired subscriptions terminated.`
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
