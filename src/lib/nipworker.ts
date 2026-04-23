/**
 * Adapter layer that bridges the real @candypoets/nipworker library to the
 * mock-compatible API used throughout the app.
 */

import {
  createNostrManager,
  setManager,
  getManager as realGetManager,
} from '@candypoets/nipworker';

import {
  useSubscription as realUseSubscription,
  useSignEvent as realUseSignEvent,
  isParsedEvent as realIsParsedEvent,
} from '@candypoets/nipworker/hooks';

export { fbArray, ConnectionTracker } from '@candypoets/nipworker/utils';

import * as flatbuffers from 'flatbuffers';
import type { EventTemplate, Event } from 'nostr-tools';

// ---------------------------------------------------------------------------
// Runtime constructors – these exist at JS runtime but are missing from the
// package's main .d.ts, so we pull them out via the namespace import.
// ---------------------------------------------------------------------------
import * as nipworkerNs from '@candypoets/nipworker';

const _WorkerMessage = (nipworkerNs as any).WorkerMessage as {
  getRootAsWorkerMessage(bb: flatbuffers.ByteBuffer, obj?: any): any;
};
const _ParsedData = (nipworkerNs as any).ParsedData as Record<string, number>;

// ---------------------------------------------------------------------------
// Default public relays injected into every subscription request
// ---------------------------------------------------------------------------
const DEFAULT_RELAYS = [
  'wss://relay.damus.io',
  'wss://nos.lol',
  'wss://relay.nostr.band',
  'wss://purplerelay.com',
];

// ---------------------------------------------------------------------------
// Initialise the global native backend once on module load
// ---------------------------------------------------------------------------
let initError: unknown;
try {
  const backend = createNostrManager();
  setManager(backend);
  console.log('[nipworker] Native backend initialised');
} catch (err) {
  initError = err;
  console.error('[nipworker] Failed to initialise native backend:', err);
}

// ---------------------------------------------------------------------------
// Re-export real types / values that are directly compatible
// ---------------------------------------------------------------------------
export const ParsedData = _ParsedData;
export type WorkerMessage = any;

export interface ParsedEvent {
  id(): string;
  kind(): number;
  pubkey(): string;
  content(): string;
  createdAt(): number;
  parsedType(): number;
  tags(): string[][];
}

// ---------------------------------------------------------------------------
// Convert a real FlatBuffers ParsedEvent into our mock-compatible shape
// ---------------------------------------------------------------------------
function convertParsedEvent(realEv: any): ParsedEvent {
  const tags: string[][] = [];
  for (let i = 0; i < realEv.tagsLength(); i++) {
    const sv = realEv.tags(i);
    if (sv) {
      const items: string[] = [];
      for (let j = 0; j < sv.itemsLength(); j++) {
        items.push(sv.items(j) as string);
      }
      tags.push(items);
    }
  }

  return {
    id: () => realEv.id() || '',
    kind: () => realEv.kind(),
    pubkey: () => realEv.pubkey() || '',
    content: () => realEv.content() || '',
    createdAt: () => realEv.createdAt(),
    parsedType: () => realEv.parsedType(),
    tags: () => tags,
  };
}

// ---------------------------------------------------------------------------
// Narrow-type helpers (mock-compatible)
// ---------------------------------------------------------------------------
export function isParsedEvent(msg: WorkerMessage): ParsedEvent | null {
  const real = realIsParsedEvent(msg);
  if (!real) return null;
  return convertParsedEvent(real);
}

export function asKind0(msg: any): ParsedEvent | null {
  if (msg?.parsedType?.() === ParsedData.Kind0Parsed) return msg;
  return null;
}

export function asKind1(msg: any): ParsedEvent | null {
  if (msg?.parsedType?.() === ParsedData.Kind1Parsed) return msg;
  return null;
}

export function asKind3(msg: any): any | null {
  if (msg?.parsedType?.() === ParsedData.Kind3Parsed) return msg;
  return null;
}

export function asKind10002(msg: any): any | null {
  if (msg?.parsedType?.() === ParsedData.Kind10002Parsed) return msg;
  return null;
}

// ---------------------------------------------------------------------------
// Synchronous caches (populated by app code via subscriptions)
// ---------------------------------------------------------------------------
export const kind0Cache = new Map<string, ParsedEvent>();
export const kind3Cache = new Map<string, ParsedEvent>();

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

export const TEST_USER_PUBKEY =
  '6a72db8ef3f3b9ee5ecd808ed6d0631d1e4dda5c5dadf07887104d33957eba48';

// ---------------------------------------------------------------------------
// Minimal ArrayBuffer reader (mirrors the internal ArrayBufferReader format)
// ---------------------------------------------------------------------------
function readMessages(
  buffer: ArrayBuffer,
  lastReadPosition = 0,
): {
  messages: WorkerMessage[];
  newReadPosition: number;
  hasNewData: boolean;
} {
  const view = new DataView(buffer);
  const writePos = view.getUint32(0, true);
  let pos = lastReadPosition < 4 ? 4 : lastReadPosition;

  if (writePos <= pos) {
    return { messages: [], newReadPosition: pos, hasNewData: false };
  }

  const messages: WorkerMessage[] = [];

  while (pos < writePos) {
    if (pos + 4 > writePos) break;
    const len = view.getUint32(pos, true);
    pos += 4;
    const end = pos + len;
    if (end > writePos) break;

    const bytes = new Uint8Array(buffer, pos, len);
    const msg = _WorkerMessage.getRootAsWorkerMessage(
      new flatbuffers.ByteBuffer(bytes),
    );
    messages.push(msg);
    pos = end;
  }

  return { messages, newReadPosition: pos, hasNewData: messages.length > 0 };
}

// ---------------------------------------------------------------------------
// Filter shape used by the app (does not include relays)
// ---------------------------------------------------------------------------
export interface FilterLike {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  tags?: Record<string, string[]>;
  since?: number;
  until?: number;
  limit?: number;
  search?: string;
}

// ---------------------------------------------------------------------------
// subscribeToEvents – compatible with the mock's signature
// ---------------------------------------------------------------------------
export function subscribeToEvents(
  subId: string,
  filters: FilterLike[],
  callback?: (message: WorkerMessage) => void,
): () => void {
  const manager = realGetManager();
  if (!manager) {
    console.warn('[nipworker] Manager not initialised');
    return () => {};
  }
  if (initError) {
    console.warn('[nipworker] Backend failed to initialise, subscription will not work');
  }

  const requests = filters.map((f) => ({
    ...f,
    relays: DEFAULT_RELAYS,
    closeOnEOSE: false,
  }));

  const buffer = manager.subscribe(subId, requests as any, { closeOnEose: false });
  let readPos = 4;

  const listener = () => {
    const result = readMessages(buffer, readPos);
    if (result.hasNewData) {
      readPos = result.newReadPosition;
      if (callback) {
        for (const msg of result.messages) {
          callback(msg);
        }
      }
    }
  };

  manager.addEventListener(`subscription:${subId}`, listener as any);
  queueMicrotask(listener);

  return () => {
    manager.removeEventListener(`subscription:${subId}`, listener as any);
    manager.unsubscribe(subId);
  };
}

// ---------------------------------------------------------------------------
// useSubscription – thin wrapper around subscribeToEvents
// ---------------------------------------------------------------------------
export function useSubscription(
  subId: string,
  filters: FilterLike[],
  callback?: (message: WorkerMessage) => void,
): () => void {
  return subscribeToEvents(subId, filters, callback);
}

// ---------------------------------------------------------------------------
// useSignEvent – returns a no-op cleanup to match the mock signature
// ---------------------------------------------------------------------------
export function useSignEvent(
  template: EventTemplate,
  callback: (event: Event) => void,
): () => void {
  realUseSignEvent(template, callback);
  return () => {};
}

// ---------------------------------------------------------------------------
// getManager – re-export the real global manager
// ---------------------------------------------------------------------------
export function getManager() {
  return realGetManager();
}
