/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ParsedData {
  Kind0Parsed = 0,
  Kind1Parsed = 1,
  Kind3Parsed = 2,
  Kind10002Parsed = 3,
  Kind10019Parsed = 4,
  ListParsed = 5,
}

export interface WorkerMessage {
  __mock: true;
}

export interface RequestObject {
  kinds?: number[];
  authors?: string[];
  ids?: string[];
  relays?: string[];
  limit?: number;
  cacheFirst?: boolean;
  noOptimize?: boolean;
  tags?: Record<string, string[]>;
}

export interface Kind10002Parsed {
  createdAt(): number;
  relays(): Array<{ url(): string; write(): boolean; read(): boolean }>;
}

export interface Kind3Parsed {
  createdAt(): number;
  contacts(): Array<{ pubkey(): string }>;
}

export interface ParsedEvent<T = unknown> {
  id(): string;
  kind(): number;
  pubkey(): string;
  content(): string;
  createdAt(): number;
  parsedType(): ParsedData;
  tags(): string[][];
}

export function getManager() {
  return {
    setSigner(_type: string, _key?: string) {},
    addEventListener(_event: string, _handler: (e: any) => void) {},
    cleanup() {},
  };
}

function createMockParsedEvent(
  data: {
    id: string;
    kind: number;
    pubkey: string;
    content: string;
    createdAt: number;
    tags: string[][];
  },
  parsedType: ParsedData = ParsedData.Kind1Parsed
): ParsedEvent {
  return {
    id: () => data.id,
    kind: () => data.kind,
    pubkey: () => data.pubkey,
    content: () => data.content,
    createdAt: () => data.createdAt,
    tags: () => data.tags,
    parsedType: () => parsedType,
  };
}

export const TEST_USER_PUBKEY = '6a72db8ef3f3b9ee5ecd808ed6d0631d1e4dda5c5dadf07887104d33957eba48';

const mockKind3Events = [
  {
    id: 'k3-alice',
    kind: 3,
    pubkey: TEST_USER_PUBKEY,
    content: '',
    createdAt: Math.floor(Date.now() / 1000) - 86400,
    tags: [
      ['p', '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777', 'wss://relay.example.com'],
      ['p', 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456', ''],
    ],
  },
];

const mockKind0Events = [
  {
    id: 'k0-alice',
    kind: 0,
    pubkey: '6a72db8ef3f3b9ee5ecd808ed6d0631d1e4dda5c5dadf07887104d33957eba48',
    content: JSON.stringify({
      name: 'Alice',
      about: 'Nostr enthusiast & eCash user',
      picture: 'https://i.pravatar.cc/150?u=alice',
      nip05: 'alice@example.com',
      banner: 'https://picsum.photos/800/300?u=alice',
      lud16: 'alice@walletofsatoshi.com',
      website: 'https://alice.dev',
    }),
    createdAt: Math.floor(Date.now() / 1000) - 86400,
    tags: [],
  },
  {
    id: 'k0-bob',
    kind: 0,
    pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
    content: JSON.stringify({
      name: 'Bob',
      about: 'Bitcoin maximalist',
      picture: 'https://i.pravatar.cc/150?u=bob',
    }),
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    tags: [],
  },
  {
    id: 'k0-carol',
    kind: 0,
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    content: JSON.stringify({
      name: 'Carol',
      about: 'Building on Nostr',
      picture: 'https://i.pravatar.cc/150?u=carol',
    }),
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
    tags: [],
  },
];

export const kind0Cache = new Map<string, ParsedEvent>();
export const kind3Cache = new Map<string, ParsedEvent>();

// Pre-populate cache with mock kind0 events
mockKind0Events.forEach((e) => {
  kind0Cache.set(e.pubkey, createMockParsedEvent(e, ParsedData.Kind0Parsed));
});

// Pre-populate cache with mock kind3 events
mockKind3Events.forEach((e) => {
  kind3Cache.set(e.pubkey, createMockParsedEvent(e, ParsedData.Kind3Parsed));
});

const mockNotificationEvents = [
  {
    id: 'notif-reply-1',
    kind: 1,
    pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
    content: 'Replying to your post!',
    createdAt: Math.floor(Date.now() / 1000) - 120,
    tags: [
      ['e', 'ev1', '', 'reply'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-reply-2',
    kind: 1,
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    content: 'Great point, totally agree!',
    createdAt: Math.floor(Date.now() / 1000) - 300,
    tags: [
      ['e', 'ev2', '', 'reply'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-mention-1',
    kind: 1,
    pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
    content: 'Hey @alice check this out!',
    createdAt: Math.floor(Date.now() / 1000) - 600,
    tags: [
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-mention-2',
    kind: 1,
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    content: 'Alice you should see this thread',
    createdAt: Math.floor(Date.now() / 1000) - 900,
    tags: [
      ['e', 'ev99'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-reaction-1',
    kind: 7,
    pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
    content: '❤️',
    createdAt: Math.floor(Date.now() / 1000) - 180,
    tags: [
      ['e', 'ev1'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-reaction-2',
    kind: 7,
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    content: '🚀',
    createdAt: Math.floor(Date.now() / 1000) - 450,
    tags: [
      ['e', 'ev3'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-repost-1',
    kind: 6,
    pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
    content: 'Reposting...',
    createdAt: Math.floor(Date.now() / 1000) - 240,
    tags: [
      ['e', 'ev1'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
  {
    id: 'notif-repost-2',
    kind: 6,
    pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
    content: 'Reposting...',
    createdAt: Math.floor(Date.now() / 1000) - 720,
    tags: [
      ['e', 'ev2'],
      ['p', TEST_USER_PUBKEY],
    ],
  },
];

export function getKind0(pubkey: string): ParsedEvent | undefined {
  return kind0Cache.get(pubkey);
}

export function getKind3(pubkey: string): ParsedEvent | undefined {
  return kind3Cache.get(pubkey);
}

export function getFollows(pubkey: string): string[] {
  const k3 = kind3Cache.get(pubkey);
  if (!k3) return [];
  const follows: string[] = [];
  const tags = k3.tags();
  if (tags) {
    tags.forEach((tag: string[]) => {
      if (tag[0] === 'p' && tag[1]) follows.push(tag[1]);
    });
  }
  return follows;
}

export function useSubscription(
  _subId: string,
  filters: RequestObject[],
  callback?: (msg: WorkerMessage) => void
): () => void {
  return subscribeToEvents(_subId, filters, callback);
}

export function subscribeToEvents(
  _subId: string,
  filters: RequestObject[],
  callback?: (msg: WorkerMessage) => void
): () => void {
  if (callback && filters.some((f) => f.kinds?.includes(3))) {
    const timeout = setTimeout(() => {
      filters.forEach((f) => {
        if (!f.kinds?.includes(3)) return;
        const authors = f.authors;
        mockKind3Events.forEach((e) => {
          if (!authors || authors.length === 0 || authors.includes(e.pubkey)) {
            callback(createMockParsedEvent(e, ParsedData.Kind3Parsed) as unknown as WorkerMessage);
          }
        });
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }

  if (callback && filters.some((f) => f.kinds?.includes(0))) {
    const timeout = setTimeout(() => {
      filters.forEach((f) => {
        if (!f.kinds?.includes(0)) return;
        const authors = f.authors;
        mockKind0Events.forEach((e) => {
          if (!authors || authors.includes(e.pubkey)) {
            callback(createMockParsedEvent(e, ParsedData.Kind0Parsed) as unknown as WorkerMessage);
          }
        });
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }

  // Notification events: kinds [1,6,7] with #p tag referencing TEST_USER_PUBKEY
  const hasNotificationFilter = filters.some((f) => {
    const kinds = f.kinds || [];
    const hasKinds = kinds.includes(1) || kinds.includes(6) || kinds.includes(7);
    const pTags = f.tags?.p || [];
    const hasPTag = pTags.includes(TEST_USER_PUBKEY);
    const noAuthors = !f.authors || f.authors.length === 0;
    return hasKinds && hasPTag && noAuthors;
  });

  if (callback && hasNotificationFilter) {
    const timeout = setTimeout(() => {
      mockNotificationEvents.forEach((e) => {
        callback(createMockParsedEvent(e) as unknown as WorkerMessage);
      });
    }, 100);
    return () => clearTimeout(timeout);
  }

  if (callback && filters.some((f) => f.kinds?.includes(1))) {
    const baseTime = Math.floor(Date.now() / 1000);
    const mockEvents = [
      {
        id: 'ev1',
        kind: 1,
        pubkey: '6a72db8ef3f3b9ee5ecd808ed6d0631d1e4dda5c5dadf07887104d33957eba48',
        content: 'Hello from mock nipworker!',
        createdAt: baseTime - 60,
        tags: [],
      },
      {
        id: 'ev2',
        kind: 1,
        pubkey: '49c3f0ee826a80010c75a66a3e2fb75324302a6969ad62f1e557a6b6dc667777',
        content: 'Just sent some eCash over Nostr. Lightning fast and private! ⚡',
        createdAt: baseTime - 300,
        tags: [],
      },
      {
        id: 'ev3',
        kind: 1,
        pubkey: 'a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456',
        content: 'The migration to ReactLynx is looking great. Native navigation feels so much smoother.',
        createdAt: baseTime - 900,
        tags: [],
      },
      {
        id: 'ev4',
        kind: 1,
        pubkey: 'b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678',
        content: 'Exploring the decentralized web with Nostr and eCash.',
        createdAt: baseTime - 1200,
        tags: [['t', 'nostr'], ['t', 'ecash']],
      },
    ];

    const authorsSet = new Set<string>();
    filters.forEach((f) => {
      if (f.kinds?.includes(1) && f.authors) {
        f.authors.forEach((a) => authorsSet.add(a));
      }
    });

    const timeout = setTimeout(() => {
      mockEvents.forEach((e) => {
        if (authorsSet.size === 0 || authorsSet.has(e.pubkey)) {
          callback(createMockParsedEvent(e) as unknown as WorkerMessage);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }
  return () => {};
}

export function useSignEvent(
  unsigned: any,
  callback: (signedEvent: any) => void
): () => void {
  const mockSigned = {
    id: 'mock-id',
    pubkey: unsigned.pubkey || 'mock-pubkey',
    created_at: unsigned.created_at || Math.floor(Date.now() / 1000),
    kind: unsigned.kind || 1,
    tags: unsigned.tags || [],
    content: unsigned.content || '',
    sig: 'mock-sig',
  };
  setTimeout(() => callback(mockSigned), 0);
  return () => {};
}

export function isParsedEvent(msg: WorkerMessage): ParsedEvent | null {
  return (msg as any)?.parsedType ? (msg as unknown as ParsedEvent) : null;
}

export function isConnectionStatus(_msg: WorkerMessage): any | null {
  return null;
}

export function asKind0(msg: any): ParsedEvent | null {
  return msg?.parsedType?.() === ParsedData.Kind0Parsed ? msg : null;
}

export function asKind1(msg: any): any | null {
  return msg?.parsedType?.() === ParsedData.Kind1Parsed ? msg : null;
}

export function asKind10002(msg: any): Kind10002Parsed | null {
  return msg?.parsedType?.() === ParsedData.Kind10002Parsed ? msg : null;
}

export function asKind3(msg: any): Kind3Parsed | null {
  return msg?.parsedType?.() === ParsedData.Kind3Parsed ? msg : null;
}

export function fbArray<T>(obj: any, field: string): T[] | null {
  if (!obj) return null;
  const getter = obj[field];
  if (typeof getter === 'function') {
    const arr = getter.call(obj);
    return Array.isArray(arr) ? arr : null;
  }
  return null;
}

export class ConnectionTracker {
  resolutionRate = 0;
  handleMessage(_msg: WorkerMessage) {}
}
