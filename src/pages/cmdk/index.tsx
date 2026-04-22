// Original: Command palette modal (no direct Svelte equivalent, new native feature)
// Similar to search functionality in nuts-cash explore view
import { useState } from 'react';
import { root, view, text, input } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { go } from '../../lib/navigation.js';

function Page() {
  const [mode, setMode] = useState<'profiles' | 'hashtags'>('profiles');
  const [query, setQuery] = useState('');

  return (
    <PageShell title="Command Palette">
      {/* Search input */}
      <view className="px-4 pt-4">
        <view className="flex flex-row items-center gap-2 px-3 py-3 bg-white/5 border border-white/10 rounded-xl">
          <text className="text-white/50 text-lg">{mode === 'hashtags' ? '#' : '🔍'}</text>
          <input
            type="text"
            className="flex-1 text-white bg-transparent outline-none"
            placeholder={mode === 'hashtags' ? 'Enter hashtag…' : 'Search…'}
            value={query}
            onChange={(e: any) => setQuery(e.target.value)}
          />
        </view>
      </view>

      {/* Mode toggle */}
      <view className="px-4 mt-3 flex flex-row gap-2">
        <view
          className={`px-3 py-1 rounded-full ${mode === 'profiles' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setMode('profiles')}
        >
          <text className="text-white text-sm">Profiles</text>
        </view>
        <view
          className={`px-3 py-1 rounded-full ${mode === 'hashtags' ? 'bg-accent' : 'bg-white/10'}`}
          bindtap={() => setMode('hashtags')}
        >
          <text className="text-white text-sm">Hashtags</text>
        </view>
      </view>

      {/* Content */}
      <view className="px-4 mt-4">
        {mode === 'hashtags' ? (
          query.trim() ? (
            <view className="py-3 px-4 bg-white/5 rounded-xl flex flex-row items-center gap-3" bindtap={() => go(`tags:${encodeURIComponent(query.trim().replace(/^#/, ''))}`)}>
              <text className="text-accent text-lg">#</text>
              <view className="flex-1">
                <text className="text-white font-medium">#{query.trim().replace(/^#/, '')}</text>
                <text className="text-white/50 text-sm">View tag feed</text>
              </view>
            </view>
          ) : (
            <view className="py-10 items-center">
              <text className="text-white/50 text-lg">#</text>
              <text className="text-white/60 text-sm mt-2">Type a hashtag to view its feed</text>
              <text className="text-white/40 text-xs mt-1">Press Enter to navigate</text>
            </view>
          )
        ) : (
          query.trim() ? (
            <view className="py-3 px-4 bg-white/5 rounded-xl">
              <text className="text-white/60 text-sm">Profile search coming soon</text>
            </view>
          ) : (
            <view className="py-10 items-center">
              <text className="text-white/50 text-lg">🔍</text>
              <text className="text-white/60 text-sm mt-2">Start typing to search profiles</text>
            </view>
          )
        )}
      </view>
    </PageShell>
  );
}

root.render(<Page />);
