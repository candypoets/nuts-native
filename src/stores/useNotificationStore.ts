import { useState, useEffect, useCallback, useRef } from 'react';
import * as storage from './storage.js';
import { subscribeToEvents, isParsedEvent, type ParsedEvent, type WorkerMessage } from '../lib/nipworker-mock.js';

function lastReadKey(pubkey: string): string {
	return `notifications_last_read_${pubkey}`;
}

export interface NotificationStore {
	events: ParsedEvent[];
	unreadCount: number;
	lastReadAt: number;
	loaded: boolean;
	markAllRead: () => void;
}

export function useNotificationStore(pubkey: string): NotificationStore {
	const [events, setEvents] = useState<ParsedEvent[]>([]);
	const [lastReadAt, setLastReadAt] = useState<number>(0);
	const [loaded, setLoaded] = useState(false);
	const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		if (!pubkey) {
			setLoaded(true);
			return;
		}
		storage.getItem(lastReadKey(pubkey)).then((value) => {
			if (value) {
				const parsed = parseInt(value as string, 10);
				if (!isNaN(parsed)) {
					setLastReadAt(parsed);
				}
			}
			setLoaded(true);
		});
	}, [pubkey]);

	useEffect(() => {
		if (!pubkey) return;
		const requests = [
			{
				kinds: [1, 6, 7],
				tags: { p: [pubkey] },
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
	}, [pubkey]);

	const unreadCount = events.filter((e) => e.createdAt() > lastReadAt).length;

	const markAllRead = useCallback(() => {
		if (!pubkey) return;
		const now = Math.floor(Date.now() / 1000);
		setLastReadAt(now);
		storage.setItem(lastReadKey(pubkey), String(now));
	}, [pubkey]);

	return { events, unreadCount, lastReadAt, loaded, markAllRead };
}
