// Original: /root/code/nuts-cash/src/routes/modals/_profile/kind0.svelte
// Note: Also used by src/routes/_kinds/kind0.svelte
import { useState, useEffect, useCallback } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { useStores } from '../../stores/StoreContext.js';
import { StoreProvider } from '../../stores/StoreContext.js';
import { useSignEvent, getKind0, kind0Cache, ParsedData } from '../../lib/nipworker.js';
import type { ParsedEvent } from '../../lib/nipworker.js';

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

function Page() {
  const { parsedKind0, resolveKind0, key } = useStores();

  const [name, setName] = useState(parsedKind0?.name ?? '');
  const [about, setAbout] = useState(parsedKind0?.about ?? '');
  const [picture, setPicture] = useState(parsedKind0?.picture ?? '');
  const [banner, setBanner] = useState(parsedKind0?.banner ?? '');
  const [nip05, setNip05] = useState(parsedKind0?.nip05 ?? '');
  const [lud16, setLud16] = useState(parsedKind0?.lud16 ?? '');
  const [website, setWebsite] = useState(parsedKind0?.website ?? '');
  const [saved, setSaved] = useState(false);

  // Fallback: seed from kind0Cache when StoreContext is not available (standalone page)
  useEffect(() => {
    if (key?.pub && !parsedKind0) {
      const k0 = getKind0(key.pub);
      if (k0) {
        resolveKind0(k0);
      }
    }
  }, [key?.pub, parsedKind0, resolveKind0]);

  useEffect(() => {
    setName(parsedKind0?.name ?? '');
    setAbout(parsedKind0?.about ?? '');
    setPicture(parsedKind0?.picture ?? '');
    setBanner(parsedKind0?.banner ?? '');
    setNip05(parsedKind0?.nip05 ?? '');
    setLud16(parsedKind0?.lud16 ?? '');
    setWebsite(parsedKind0?.website ?? '');
  }, [parsedKind0]);

  const current = {
    name: parsedKind0?.name ?? '',
    about: parsedKind0?.about ?? '',
    picture: parsedKind0?.picture ?? '',
    banner: parsedKind0?.banner ?? '',
    nip05: parsedKind0?.nip05 ?? '',
    lud16: parsedKind0?.lud16 ?? '',
    website: parsedKind0?.website ?? '',
  };

  const next = { name, about, picture, banner, nip05, lud16, website };
  const hasChanges = !deepEqual(current, next);

  const handleSave = useCallback(() => {
    const content = JSON.stringify({
      name: name || undefined,
      about: about || undefined,
      picture: picture || undefined,
      banner: banner || undefined,
      nip05: nip05 || undefined,
      lud16: lud16 || undefined,
      website: website || undefined,
    });
    const template = {
      kind: 0,
      content,
      tags: [],
      created_at: Math.floor(Date.now() / 1000),
    };
    useSignEvent(template, (signedEvent: any) => {
      const wrapped = {
        id: () => signedEvent.id,
        kind: () => signedEvent.kind,
        pubkey: () => signedEvent.pubkey || key?.pub || 'mock-pubkey',
        content: () => signedEvent.content,
        createdAt: () => signedEvent.created_at,
        tags: () => signedEvent.tags,
        parsedType: () => ParsedData.Kind0Parsed,
      };
      resolveKind0(wrapped);
      // Persist to shared cache so getKind0() readers see the update
      const pubkey = signedEvent.pubkey || key?.pub || 'mock-pubkey';
      kind0Cache.set(pubkey, wrapped as unknown as ParsedEvent);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }, [name, about, picture, banner, nip05, lud16, website, resolveKind0, key]);

  const Field = ({
    label,
    value,
    onChange,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
  }) => (
    <view className="flex flex-col gap-1">
      <text className="text-white/70 text-sm font-medium">{label}</text>
      <view className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(e: { target?: { value?: string } }) => onChange(e.target?.value ?? '')}
          className="w-full bg-transparent text-white placeholder:text-white/30 outline-none text-sm"
        />
      </view>
    </view>
  );

  return (
      <PageShell title="Edit Profile">
      <view className="flex flex-col gap-4">
        <Field label="Name" value={name} onChange={setName} placeholder="Your display name" />
        <Field label="About" value={about} onChange={setAbout} placeholder="Short bio" />
        <Field label="Picture URL" value={picture} onChange={setPicture} placeholder="https://..." />
        <Field label="Banner URL" value={banner} onChange={setBanner} placeholder="https://..." />
        <Field label="NIP-05" value={nip05} onChange={setNip05} placeholder="name@example.com" />
        <Field label="Lightning Address" value={lud16} onChange={setLud16} placeholder="name@walletofsatoshi.com" />
        <Field label="Website" value={website} onChange={setWebsite} placeholder="https://..." />

        <view className="mt-2">
          <view
            className={`py-3 rounded-xl flex items-center justify-center ${
              hasChanges ? 'bg-white' : 'bg-white/20'
            }`}
            bindtap={hasChanges ? handleSave : undefined}
          >
            <text className={`font-semibold text-sm ${hasChanges ? 'text-black' : 'text-white/40'}`}>
              Save
            </text>
          </view>
          {saved && (
            <view className="mt-2 flex items-center justify-center">
              <text className="text-sm" style={{ color: 'var(--primary)' }}>
                Saved!
              </text>
            </view>
          )}
        </view>
      </view>
      </PageShell>
  );
}

root.render(<StoreProvider><Page /></StoreProvider>);
