import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { LandingView } from '@/components/LandingView';
import { Game } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await getSession();
  
  let games: Game[] = [];
  let error = null;

  try {
    games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  } catch (e) {
    console.error("Database connection error:", e);
    error = "System synchronizing with neural network...";
  }

  // Pass plain objects to client component
  const serializedGames = JSON.parse(JSON.stringify(games));
  const serializedSession = JSON.parse(JSON.stringify(session));

  return (
    <LandingView 
      games={serializedGames} 
      session={serializedSession} 
      error={error} 
    />
  );
}
