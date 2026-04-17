import { useState, useEffect, useRef } from 'react';
import { subscribeToEvents, isParsedEvent, TEST_USER_PUBKEY, type ParsedEvent, type WorkerMessage } from '../lib/nipworker-mock.js';

export type NotificationType = 'reply' | 'mention' | 'reaction' | 'repost';

export interface NotificationsState {
  events: ParsedEvent[];
  replies: ParsedEvent[];
  mentions: ParsedEvent[];
  reactions: ParsedEvent[];
  reposts: ParsedEvent[];
  loading: boolean;
}

function categorizeEvent(event: ParsedEvent): NotificationType | null {
  const kind = event.kind();
  const tags = event.tags();
  const hasPTag = tags.some((t) => t[0] === 'p' && t[1] === TEST_USER_PUBKEY);
  const hasETag = tags.some((t) => t[0] === 'e');

  if (kind === 1 && hasPTag && hasETag) return 'reply';
  if (kind === 1 && hasPTag && !hasETag) return 'mention';
  if (kind === 7) return 'reaction';
  if (kind === 6) return 'repost';
  return null;
}

export function useNotifications(): NotificationsState {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    const requests = [
      {
        kinds: [1, 6, 7],
        tags: { p: [TEST_USER_PUBKEY] },
      },
    ];

    unsubscribeRef.current = subscribeToEvents('notifications_page', requests, (message: WorkerMessage) => {
      const parsed = isParsedEvent(message);
      if (!parsed) return;
      setEvents((prev) => {
        if (prev.some((e) => e.id() === parsed.id())) return prev;
        const next = [...prev, parsed];
        next.sort((a, b) => b.createdAt() - a.createdAt());
        return next;
      });
      setLoading(false);
    });

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timeout);
      unsubscribeRef.current?.();
    };
  }, []);

  const replies = events.filter((e) => categorizeEvent(e) === 'reply');
  const mentions = events.filter((e) => categorizeEvent(e) === 'mention');
  const reactions = events.filter((e) => categorizeEvent(e) === 'reaction');
  const reposts = events.filter((e) => categorizeEvent(e) === 'repost');

  return { events, replies, mentions, reactions, reposts, loading };
}
