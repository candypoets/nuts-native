// Original: /root/code/nuts-cash/src/routes/modals/qr.svelte
import { useState, useEffect } from 'react';
import { root, view, text, image } from '@lynx-js/react';
import QRCode from 'qrcode';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';
import { useStores } from '../../stores/StoreContext.js';

function Page() {
  const { key } = useStores();
  const [copied, setCopied] = useState(false);
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  const qrText = key?.npub ? `nostr:${key.npub}` : 'nostr:npub1...';

  useEffect(() => {
    if (key?.npub) {
      QRCode.toDataURL(`nostr:${key.npub}`, { width: 256, margin: 2 })
        .then(setDataUrl)
        .catch((e) => setError(String(e?.message || e)));
    }
  }, [key?.npub]);

  return (
    <PageShell title="QR Code">
      <view className="py-8 flex flex-col items-center justify-center">
        <text className="text-white font-semibold text-lg">Your Profile QR</text>
        <text className="text-white/60 text-sm mt-1">Scan to view your profile</text>

        <view className="mt-6 w-64 h-64 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
          {dataUrl ? (
            <image src={dataUrl} className="w-56 h-56" />
          ) : (
            <text className="text-black text-center px-4">
              {error ? 'Failed to generate QR' : 'Generating QR code…'}
            </text>
          )}
        </view>

        <view
          className="mt-6 px-4 py-2 border border-white/20 rounded-lg flex flex-row items-center gap-2"
          bindtap={() => setCopied(true)}
        >
          <text className="text-white text-sm">{copied ? '✓ Copied!' : '📋 Copy to clipboard'}</text>
        </view>

        <text className="text-white/60 mt-4 text-sm text-center px-6">{qrText}</text>
      </view>

      <view className="px-4 mt-4 mb-8">
        <view className="py-3 bg-white/10 rounded-xl items-center" bindtap={() => goBack()}>
          <text className="text-white font-medium">Done</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
