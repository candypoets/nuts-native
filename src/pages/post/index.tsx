// Original: /root/code/nuts-cash/src/routes/modals/post.svelte
import { useState } from 'react';
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';

const MAX_CHARS = 280;

function Page() {
  const [textValue, setTextValue] = useState('');
  const canPost = textValue.trim().length > 0;

  const handlePost = () => {
    if (!canPost) return;
    goBack();
  };

  return (
    <PageShell title="New Post">
      <view className="flex flex-col h-full">
        <textarea
          placeholder="What's on your mind?"
          value={textValue}
          maxlength={MAX_CHARS}
          onChange={(e: any) => setTextValue((e.target as any).value)}
          className="w-full flex-1 min-h-[200px] px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 outline-none"
        />
        <view className="flex flex-row justify-end mt-2">
          <text
            className={`text-xs ${textValue.length > MAX_CHARS * 0.9 ? 'text-[#ff5861]' : 'text-white/40'}`}
          >
            {textValue.length}/{MAX_CHARS}
          </text>
        </view>
        <view className="mt-4 flex flex-row gap-3">
          <view
            className="flex-1 py-3 rounded-xl border border-white/10 flex items-center justify-center"
            bindtap={() => goBack()}
          >
            <text className="text-white/70 font-semibold">Cancel</text>
          </view>
          <view
            className={`flex-1 py-3 rounded-xl flex items-center justify-center ${canPost ? 'bg-accent' : 'bg-white/10 opacity-50'}`}
            bindtap={handlePost}
          >
            <text className="text-white font-semibold">Post</text>
          </view>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
