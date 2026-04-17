import { useState, useEffect, useRef } from 'react';
import { subscribeToEvents, isParsedEvent, type ParsedEvent, type WorkerMessage } from '../lib/nipworker-mock.js';

export type NotificationType = 'reply' | 'mention' | 'reaction' | 'repost';

export interface NotificationsState {
	events: ParsedEvent[];
	replies: ParsedEvent[];
	mentions: ParsedEvent[];
	reactions: ParsedEvent[];
	reposts: ParsedEvent[];
	loading: boolean;
}

export function categorizeEvent(event: ParsedEvent, pubkey: string): NotificationType | null {
	const kind = event.kind();
	const tags = event.tags();
	const hasPTag = tags.some((t) => t[0] === 'p' && t[1] === pubkey);
	const hasReplyMarker = tags.some((t) => t[0] === 'e' && (t[3] === 'reply' || t[3] === 'root'));

	if (kind === 1 && hasPTag && hasReplyMarker) return 'reply';
	if (kind === 1 && hasPTag) return 'mention';
	if (kind === 7) return 'reaction';
	if (kind === 6) return 'repost';
	return null;
}

export function useNotifications(pubkey: string): NotificationsState {
	const [events, setEvents] = useState<ParsedEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

	useEffect(() => {
		if (!pubkey) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const requests = [
			{
				kinds: [1, 6, 7],
				tags: { p: [pubkey] },
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
	}, [pubkey]);

	const replies = events.filter((e) => categorizeEvent(e, pubkey) === 'reply');
	const mentions = events.filter((e) => categorizeEvent(e, pubkey) === 'mention');
	const reactions = events.filter((e) => categorizeEvent(e, pubkey) === 'reaction');
	const reposts = events.filter((e) => categorizeEvent(e, pubkey) === 'repost');

	return { events, replies, mentions, reactions, reposts, loading };
}
