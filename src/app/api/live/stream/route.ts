import { NextRequest } from 'next/server';
import { events, EVENT_TYPES } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  // Function to send data formatted for SSE
  const sendEvent = (data: any) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  // Listener for new games
  const onNewGame = (game: any) => {
    sendEvent({ type: 'NEW_GAME', payload: game });
  };

  // Attach listener
  events.on(EVENT_TYPES.NEW_GAME, onNewGame);

  // Send initial connected message
  sendEvent({ type: 'CONNECTED', message: 'Neural Network Stream Active' });

  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
    events.off(EVENT_TYPES.NEW_GAME, onNewGame);
    writer.close();
  });

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
