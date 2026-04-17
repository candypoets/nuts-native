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

function createMockParsedEvent(data: {
  id: string;
  kind: number;
  pubkey: string;
  content: string;
  createdAt: number;
  tags: string[][];
}): ParsedEvent {
  return {
    id: () => data.id,
    kind: () => data.kind,
    pubkey: () => data.pubkey,
    content: () => data.content,
    createdAt: () => data.createdAt,
    tags: () => data.tags,
    parsedType: () => ParsedData.Kind1Parsed,
  };
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

    const timeout = setTimeout(() => {
      mockEvents.forEach((e) => {
        callback(createMockParsedEvent(e) as unknown as WorkerMessage);
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
