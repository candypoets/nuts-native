import { root, view, text, image } from '@lynx-js/react';
import { useState } from 'react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

const MOCK_PARENT = {
  avatar: 'asset:///miss-profile.png',
  name: 'Mock User',
  content: 'This is the note you are replying to. In the real app this comes from the selected note.',
};

const MAX_CHARS = 280;

function Page() {
  const [replyText, setReplyText] = useState('');
  const canReply = replyText.trim().length > 0;

  const handleReply = () => {
    if (!canReply) return;
    // Publish logic placeholder
    goBack();
  };

  return (
    <PageShell title="Reply">
      <view className="flex flex-col h-full">
        {/* Replying to header */}
        <view className="mb-4 p-3 bg-white/5 rounded-xl border border-white/10">
          <text className="text-white/50 text-xs mb-2">Replying to</text>
          <view className="flex flex-row items-center gap-3">
            <image
              src={MOCK_PARENT.avatar}
              className="w-10 h-10 rounded-full border border-white/10"
            />
            <view className="flex-1">
              <text className="text-white font-semibold text-sm">{MOCK_PARENT.name}</text>
              <text className="text-white/60 text-xs mt-0.5">
                {MOCK_PARENT.content.length > 60
                  ? MOCK_PARENT.content.slice(0, 60) + '...'
                  : MOCK_PARENT.content}
              </text>
            </view>
          </view>
        </view>

        {/* Textarea */}
        <textarea
          placeholder="Write your reply..."
          value={replyText}
          maxlength={MAX_CHARS}
          onChange={(e: any) => setReplyText((e.target as any).value)}
          className="w-full flex-1 min-h-[160px] px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
        />

        {/* Character counter */}
        <view className="flex flex-row justify-end mt-2">
          <text
            className={`text-xs ${replyText.length > MAX_CHARS * 0.9 ? 'text-[#ff5861]' : 'text-white/40'}`}
          >
            {replyText.length}/{MAX_CHARS}
          </text>
        </view>

        {/* Actions */}
        <view className="mt-4 flex flex-row gap-3">
          <view
            className="flex-1 py-3 rounded-xl border border-white/10 flex items-center justify-center"
            bindtap={goBack}
          >
            <text className="text-white/70 font-semibold">Cancel</text>
          </view>
          <view
            className={`flex-1 py-3 rounded-xl flex items-center justify-center ${canReply ? 'bg-accent' : 'bg-white/10 opacity-50'}`}
            bindtap={handleReply}
          >
            <text className="text-white font-semibold">Reply</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
