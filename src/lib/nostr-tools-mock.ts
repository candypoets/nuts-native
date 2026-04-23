/**
 * Minimal mock of `nostr-tools` that satisfies the APIs used by
 * @candypoets/nipworker (nip19, generateSecretKey, getPublicKey, finalizeEvent,
 * EventTemplate) while avoiding code paths with QuickJS-incompatible regexes
 * (e.g. \p{Letter} / \p{Number}).
 *
 * This is a pure-JS implementation using @noble/curves, @noble/hashes, and
 * bech32 — all of which are already in node_modules.
 */

import { schnorr } from '@noble/curves/secp256k1';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { sha256 } from '@noble/hashes/sha256';
import { bech32 } from 'bech32';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface EventTemplate {
  kind: number;
  content: string;
  tags: string[][];
  created_at?: number;
}

export interface Event extends EventTemplate {
  id: string;
  pubkey: string;
  created_at: number;
  sig: string;
}

export type NostrEvent = Event;

// ---------------------------------------------------------------------------
// Crypto (pure.ts equivalents)
// ---------------------------------------------------------------------------

export function generateSecretKey(): Uint8Array {
  return schnorr.utils.randomPrivateKey();
}

export function getPublicKey(secretKey: Uint8Array | string): string {
  const sk =
    typeof secretKey === 'string'
      ? hexToBytes(secretKey)
      : secretKey;
  return bytesToHex(schnorr.getPublicKey(sk));
}

export function serializeEvent(event: Event): string {
  return JSON.stringify([
    0,
    event.pubkey,
    event.created_at,
    event.kind,
    event.tags,
    event.content,
  ]);
}

export function getEventHash(event: EventTemplate): string {
  const e = {
    ...event,
    pubkey: (event as any).pubkey || '',
    created_at: event.created_at ?? 0,
  } as Event;
  const hash = sha256(new TextEncoder().encode(serializeEvent(e)));
  return bytesToHex(hash);
}

export function finalizeEvent(
  t: EventTemplate,
  secretKey: Uint8Array,
): Event {
  const pubkey = getPublicKey(secretKey);
  const event: Event = {
    ...t,
    pubkey,
    created_at: t.created_at ?? Math.floor(Date.now() / 1000),
    id: '',
    sig: '',
  };
  event.id = getEventHash(event);
  event.sig = bytesToHex(schnorr.sign(event.id, secretKey));
  return event;
}

export function verifyEvent(event: Event): boolean {
  try {
    const hash = getEventHash(event);
    if (hash !== event.id) return false;
    return schnorr.verify(event.sig, event.id, event.pubkey);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// nip19 (bech32 Nostr identifiers)
// ---------------------------------------------------------------------------

const MAX_SIZE = 5000;
const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder();

function hexToBytesSafe(hex: string): Uint8Array {
  return hexToBytes(hex);
}

function encodeTLV(tlv: Record<number, Uint8Array[]>): Uint8Array {
  const entries: Uint8Array[] = [];
  Object.entries(tlv)
    .reverse()
    .forEach(([t, vs]) => {
      vs.forEach((v) => {
        const entry = new Uint8Array(v.length + 2);
        entry.set([parseInt(t, 10)], 0);
        entry.set([v.length], 1);
        entry.set(v, 2);
        entries.push(entry);
      });
    });
  const total = entries.reduce((sum, e) => sum + e.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const e of entries) {
    result.set(e, offset);
    offset += e.length;
  }
  return result;
}

function parseTLV(data: Uint8Array): Record<number, Uint8Array[]> {
  const result: Record<number, Uint8Array[]> = {};
  let rest = data;
  while (rest.length > 0) {
    const t = rest[0];
    const l = rest[1];
    const v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l) break;
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}

function integerToUint8Array(n: number): Uint8Array {
  const u = new Uint8Array(4);
  const dv = new DataView(u.buffer);
  dv.setUint32(0, n, false);
  return u;
}

function encodeBech32(prefix: string, data: Uint8Array): string {
  const words = bech32.toWords(data);
  return bech32.encode(prefix, words, MAX_SIZE);
}

export type DecodedNevent = { type: 'nevent'; data: { id: string; relays?: string[]; author?: string; kind?: number } };
export type DecodedNprofile = { type: 'nprofile'; data: { pubkey: string; relays?: string[] } };
export type DecodedNaddr = { type: 'naddr'; data: { identifier: string; pubkey: string; kind: number; relays?: string[] } };
export type DecodedNsec = { type: 'nsec'; data: Uint8Array };
export type DecodedNpub = { type: 'npub'; data: string };
export type DecodedNote = { type: 'note'; data: string };
export type DecodedResult = DecodedNevent | DecodedNprofile | DecodedNaddr | DecodedNpub | DecodedNsec | DecodedNote;

export function decode(code: string): DecodedResult {
  const { prefix, words } = bech32.decode(code, MAX_SIZE);
  const data = new Uint8Array(bech32.fromWords(words));

  switch (prefix) {
    case 'nprofile': {
      const tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error('missing TLV 0 for nprofile');
      if (tlv[0][0].length !== 32) throw new Error('TLV 0 should be 32 bytes');
      return {
        type: 'nprofile',
        data: {
          pubkey: bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
        },
      };
    }
    case 'nevent': {
      const tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error('missing TLV 0 for nevent');
      if (tlv[0][0].length !== 32) throw new Error('TLV 0 should be 32 bytes');
      if (tlv[2] && tlv[2][0].length !== 32) throw new Error('TLV 2 should be 32 bytes');
      if (tlv[3] && tlv[3][0].length !== 4) throw new Error('TLV 3 should be 4 bytes');
      return {
        type: 'nevent',
        data: {
          id: bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: tlv[2]?.[0] ? bytesToHex(tlv[2][0]) : undefined,
          kind: tlv[3]?.[0] ? parseInt(bytesToHex(tlv[3][0]), 16) : undefined,
        },
      };
    }
    case 'naddr': {
      const tlv = parseTLV(data);
      if (!tlv[0]?.[0]) throw new Error('missing TLV 0 for naddr');
      if (!tlv[2]?.[0]) throw new Error('missing TLV 2 for naddr');
      if (tlv[2][0].length !== 32) throw new Error('TLV 2 should be 32 bytes');
      if (!tlv[3]?.[0]) throw new Error('missing TLV 3 for naddr');
      if (tlv[3][0].length !== 4) throw new Error('TLV 3 should be 4 bytes');
      return {
        type: 'naddr',
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: bytesToHex(tlv[2][0]),
          kind: parseInt(bytesToHex(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
        },
      };
    }
    case 'nsec':
      return { type: 'nsec', data };
    case 'npub':
    case 'note':
      return { type: prefix, data: bytesToHex(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}

export function nsecEncode(key: Uint8Array): string {
  const words = bech32.toWords(key);
  return bech32.encode('nsec', words, MAX_SIZE);
}

export function npubEncode(hex: string): string {
  const words = bech32.toWords(hexToBytesSafe(hex));
  return bech32.encode('npub', words, MAX_SIZE);
}

export function noteEncode(hex: string): string {
  const words = bech32.toWords(hexToBytesSafe(hex));
  return bech32.encode('note', words, MAX_SIZE);
}

export function nprofileEncode(profile: { pubkey: string; relays?: string[] }): string {
  const data = encodeTLV({
    0: [hexToBytesSafe(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder.encode(url)),
  });
  return encodeBech32('nprofile', data);
}

export function neventEncode(event: { id: string; relays?: string[]; author?: string; kind?: number }): string {
  const kindArray = event.kind !== undefined ? integerToUint8Array(event.kind) : undefined;
  const data = encodeTLV({
    0: [hexToBytesSafe(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
    2: event.author ? [hexToBytesSafe(event.author)] : [],
    3: kindArray ? [new Uint8Array(kindArray)] : [],
  });
  return encodeBech32('nevent', data);
}

export function naddrEncode(addr: { identifier: string; pubkey: string; kind: number; relays?: string[] }): string {
  const kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  const data = encodeTLV({
    0: [utf8Encoder.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
    2: [hexToBytesSafe(addr.pubkey)],
    3: [new Uint8Array(kind)],
  });
  return encodeBech32('naddr', data);
}

// ---------------------------------------------------------------------------
// nip19 entry point object (used by @candypoets/nipworker)
// ---------------------------------------------------------------------------

export const nip19 = {
  decode,
  npubEncode,
  nsecEncode,
  noteEncode,
  nprofileEncode,
  neventEncode,
  naddrEncode,
};
