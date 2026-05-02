import { EventEmitter } from 'events';

// Global singleton for events
const globalEvents = global as unknown as { events: EventEmitter };

export const events = globalEvents.events || new EventEmitter();

if (process.env.NODE_ENV !== 'production') globalEvents.events = events;

export const EVENT_TYPES = {
  NEW_GAME: 'new_game',
  USER_UPGRADED: 'user_upgraded'
};
