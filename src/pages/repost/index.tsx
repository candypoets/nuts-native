import { root, view, text, image, input } from '@lynx-js/react';
import { useState } from 'react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [quote, setQuote] = useState('');

  return (
    <PageShell title="Repost">
      <view className="py-4 space-y-4">
        <text className="text-white text-lg font-semibold">Repost this note?</text>

        {/* Mock note card */}
        <view className="w-full bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <view className="flex flex-row items-center gap-3">
            <image
              src="asset:///miss-profile.png"
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <view>
              <text className="text-white font-medium">Mock User</text>
              <text className="text-white/40 text-xs">2h ago</text>
            </view>
          </view>
          <text className="text-white/80 text-sm leading-relaxed">
            This is the note being reposted. In the real app this content comes from the note you selected.
          </text>
        </view>

        {/* Quote input */}
        <view className="space-y-2">
          <text className="text-white/60 text-sm">Add a comment</text>
          <input
            type="text"
            placeholder="Say something about this..."
            value={quote}
            onChange={(e: any) => setQuote((e.target as any).value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
          />
        </view>

        {/* Actions */}
        <view className="flex flex-row gap-3 pt-2">
          <view
            className="flex-1 py-3 rounded-xl border border-white/10 flex items-center justify-center"
            bindtap={goBack}
          >
            <text className="text-white/80 font-medium">Cancel</text>
          </view>
          <view
            className="flex-1 py-3 rounded-xl bg-accent flex items-center justify-center"
            bindtap={() => {
              // Publish logic placeholder
            }}
          >
            <text className="text-white font-semibold">Repost</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
