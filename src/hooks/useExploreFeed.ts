import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribeToEvents, isParsedEvent, asKind1, type ParsedEvent, type WorkerMessage } from '../lib/nipworker.js';

export interface ExploreFeedState {
  events: ParsedEvent[];
  loading: boolean;
  refreshing: boolean;
  hasMore: boolean;
  onRefresh: () => void;
  onNearBottom: () => void;
}

const LIMIT = 20;

export function useExploreFeed(): ExploreFeedState {
  const [events, setEvents] = useState<ParsedEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const seenIds = useRef<Set<string>>(new Set());
  const untilRef = useRef<number | undefined>(undefined);
  const pageCounterRef = useRef(0);
  const refreshCounterRef = useRef(0);
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);
  const paginationUnsubscribeRef = useRef<(() => void) | undefined>(undefined);
  const paginationTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paginationCleanupTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const paginationLoadingClearedRef = useRef(false);
  const itemsBeforePaginationRef = useRef(0);
  const eventsRef = useRef(events);
  eventsRef.current = events;

  const subscribe = useCallback((forPagination = false) => {
    const requests = [
      {
        kinds: [1],
        limit: LIMIT,
        until: forPagination ? untilRef.current : undefined,
      },
    ];

    if (forPagination) {
      pageCounterRef.current += 1;
      const pageSubId = `explore_page_${pageCounterRef.current}_${untilRef.current}`;
      paginationUnsubscribeRef.current?.();
      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
      }
      paginationLoadingClearedRef.current = false;
      paginationUnsubscribeRef.current = subscribeToEvents(pageSubId, requests, (message: WorkerMessage) => {
        const parsed = isParsedEvent(message);
        const kind1 = asKind1(parsed);
        if (!kind1 || !parsed) return;

        const eventId = parsed.id();
        if (seenIds.current.has(eventId)) return;
        seenIds.current.add(eventId);

        setEvents((prev) => {
          const next = [...prev, parsed];
          next.sort((a, b) => b.createdAt() - a.createdAt());
          return next;
        });

        if (!paginationLoadingClearedRef.current) {
          setLoading(false);
          paginationLoadingClearedRef.current = true;
        }
      });

      paginationTimeoutRef.current = setTimeout(() => {
        setLoading(false);
      }, 5000);
    } else {
      refreshCounterRef.current += 1;
      const subId = `explore_feed_${refreshCounterRef.current}`;
      unsubscribeRef.current?.();
      unsubscribeRef.current = subscribeToEvents(subId, requests, (message: WorkerMessage) => {
        const parsed = isParsedEvent(message);
        const kind1 = asKind1(parsed);
        if (!kind1 || !parsed) return;

        const eventId = parsed.id();
        if (seenIds.current.has(eventId)) return;
        seenIds.current.add(eventId);

        setEvents((prev) => {
          const next = [...prev, parsed];
          next.sort((a, b) => b.createdAt() - a.createdAt());
          return next;
        });

        // Clear loading when we receive at least one event during refresh
        setLoading(false);
        setRefreshing(false);
      });
    }
  }, []);

  const onRefresh = useCallback(() => {
    if (refreshing) return;
    setRefreshing(true);
    setLoading(true);
    setEvents([]);
    seenIds.current.clear();
    untilRef.current = undefined;
    setHasMore(true);
    itemsBeforePaginationRef.current = 0;
    paginationUnsubscribeRef.current?.();
    paginationUnsubscribeRef.current = undefined;
    subscribe(false);
  }, [refreshing, subscribe]);

  const onNearBottom = useCallback(() => {
    if (loading || !hasMore || eventsRef.current.length === 0) return;

    setLoading(true);
    itemsBeforePaginationRef.current = eventsRef.current.length;
    const lastEvent = eventsRef.current[eventsRef.current.length - 1];
    untilRef.current = lastEvent.createdAt() - 1;
    subscribe(true);
  }, [loading, hasMore, subscribe]);

  // Check pagination results after loading settles
  useEffect(() => {
    if (!loading && itemsBeforePaginationRef.current > 0) {
      const itemsAtCheck = itemsBeforePaginationRef.current;
      itemsBeforePaginationRef.current = 0;

      if (paginationTimeoutRef.current) {
        clearTimeout(paginationTimeoutRef.current);
        paginationTimeoutRef.current = undefined;
      }

      const checkTimeout = setTimeout(() => {
        setEvents((current) => {
          const newItemsAdded = current.length - itemsAtCheck;
          if (newItemsAdded === 0) {
            setHasMore(false);
          }
          return current;
        });

        paginationCleanupTimeoutRef.current = setTimeout(() => {
          paginationUnsubscribeRef.current?.();
          paginationUnsubscribeRef.current = undefined;
        }, 2000);
      }, 300);

      return () => clearTimeout(checkTimeout);
    }
  }, [loading]);

  // Initial subscription
  useEffect(() => {
    setLoading(true);
    subscribe(false);

    // Safety timeout for initial load
    const initTimeout = setTimeout(() => {
      setLoading(false);
      setRefreshing(false);
    }, 3000);

    return () => {
      clearTimeout(initTimeout);
      unsubscribeRef.current?.();
      paginationUnsubscribeRef.current?.();
      if (paginationTimeoutRef.current) clearTimeout(paginationTimeoutRef.current);
      if (paginationCleanupTimeoutRef.current) clearTimeout(paginationCleanupTimeoutRef.current);
    };
  }, [subscribe]);

  return {
    events,
    loading,
    refreshing,
    hasMore,
    onRefresh,
    onNearBottom,
  };
}
