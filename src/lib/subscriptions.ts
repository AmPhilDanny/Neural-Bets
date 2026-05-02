import prisma from '@/lib/prisma';

/**
 * Checks and updates a user's subscription status.
 * Downgrades to FREE if expired + 1 day grace period.
 */
export async function enforceSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, tier: true, subscriptionEnds: true }
  });

  if (!user || user.tier === 'FREE' || !user.subscriptionEnds) {
    return;
  }

  const now = new Date();
  const graceDate = new Date(user.subscriptionEnds);
  graceDate.setDate(graceDate.getDate() + 1); // 1-day grace period

  if (now > graceDate) {
    await prisma.user.update({
      where: { id: userId },
      data: { tier: 'FREE' }
    });
    console.log(`User ${userId} subscription expired and was terminated.`);
  }
}
