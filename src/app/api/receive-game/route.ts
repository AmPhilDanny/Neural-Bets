import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { notifyNewOdds } from '@/lib/notifications';
import { events, EVENT_TYPES } from '@/lib/events';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const source = request.headers.get('X-Source');

    // Simple Bearer token validation
    const expectedKey = process.env.NEURAL_BETS_API_KEY;
    if (!expectedKey) {
      console.error('NEURAL_BETS_API_KEY not set in environment variables');
      return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
    }

    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const { externalId, totalOdds, confidence, targetOdds, matches, category, isPremium } = data;

    if (!totalOdds || !matches) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 });
    }

    const game = await prisma.game.upsert({
      where: { externalId: externalId || 'none' },
      update: {
        totalOdds,
        confidence,
        targetOdds,
        category: category || "2x",
        isPremium: isPremium ?? false,
        matches: JSON.stringify(matches),
        pushedAt: new Date()
      },
      create: {
        externalId,
        totalOdds,
        confidence,
        targetOdds,
        category: category || "2x",
        isPremium: isPremium ?? false,
        matches: JSON.stringify(matches)
      }
    });

    // Emit event for real-time updates
    events.emit(EVENT_TYPES.NEW_GAME, game);

    // Trigger notifications for new games
    try {
      await notifyNewOdds(category || "2x", totalOdds);
    } catch (e) {
      console.error('Notification trigger failed:', e);
    }

    return NextResponse.json({
      success: true,
      id: game.id,
      message: 'Game received and posted'
    });

  } catch (error: any) {
    console.error('Receive error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: 'One-way API: Push only' 
  }, { status: 405 });
}
