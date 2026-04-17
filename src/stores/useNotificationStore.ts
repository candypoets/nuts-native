import { useState, useEffect, useCallback, useRef } from 'react';
import * as storage from './storage.js';
import { subscribeToEvents, isParsedEvent, type ParsedEvent, type WorkerMessage } from '../lib/nipworker-mock.js';

const LAST_READ_KEY = 'notifications_last_read';

export interface NotificationStore {
  events: ParsedEvent[];
  unreadCount: number;
  lastReadAt: number;
  loaded: boolean;
  markAllRead: () => void;
}

export function useNotificationStore(): NotificationStore {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [lastReadAt, setLastReadAt] = useState<number>(0);
  const [loaded, setLoaded] = useState(false);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    storage.getItem(LAST_READ_KEY).then((value) => {
      if (value) {
        const parsed = parseInt(value as string, 10);
        if (!isNaN(parsed)) {
          setLastReadAt(parsed);
        }
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    const requests = [
      {
        kinds: [1, 6, 7],
        tags: { p: ['6a72db8ef3f3b9ee5ecd808ed6d0631d1e4dda5c5dadf07887104d33957eba48'] },
      },
    ];

    unsubscribeRef.current = subscribeToEvents('notifications', requests, (message: WorkerMessage) => {
      const parsed = isParsedEvent(message);
      if (!parsed) return;
      setEvents((prev) => {
        if (prev.some((e) => e.id() === parsed.id())) return prev;
        const next = [...prev, parsed];
        next.sort((a, b) => b.createdAt() - a.createdAt());
        return next;
      });
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, []);

  const unreadCount = events.filter((e) => e.createdAt() > lastReadAt).length;

  const markAllRead = useCallback(() => {
    const now = Math.floor(Date.now() / 1000);
    setLastReadAt(now);
    storage.setItem(LAST_READ_KEY, String(now));
  }, []);

  return { events, unreadCount, lastReadAt, loaded, markAllRead };
}
