// Original: /root/code/nuts-cash/src/routes/+page.svelte (main tab container)
// Note: App structure is in src/routes/index.svelte
import '../../app.css';
import { useEffect, useState } from 'react';
import { view, text } from '@lynx-js/react';
import { StoreProvider, useStores } from '../../stores/StoreContext.js';
import { getManager } from '../../lib/nipworker.js';
import { HomeView } from './HomeView';
import { ExploreView } from './ExploreView';
import { ChatView } from './ChatView';
import { OverlayContainer, BackgroundWrapper } from '../../components/OverlayContainer.js';

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <view
      className={`flex-1 flex flex-col items-center justify-center py-2 ${active ? 'opacity-100' : 'opacity-50'}`}
      bindtap={onClick}
    >
      <text className="text-sm text-white font-medium">{label}</text>
    </view>
  );
}

function MainApp() {
  const [tab, setTab] = useState<'home' | 'explore' | 'chat'>('explore');
  const stores = useStores();

  useEffect(() => {
    const manager = getManager();
    manager.addEventListener('auth', (event: any) => {
      stores.setKey((prev: any) => ({
        ...prev,
        pub: event?.detail?.pubkey || '',
        hasSigner: event?.detail?.hasSigner || false,
      }));
    });
  }, [stores.setKey]);

  return (
    <view className="mobile-height bg-base-200 flex flex-col relative">
      <BackgroundWrapper>
        <view className="flex-1 overflow-hidden flex flex-col">
          {tab === 'home' && <view key="home-tab" className="flex-1 flex flex-col"><HomeView /></view>}
          {tab === 'explore' && <view key="explore-tab" className="flex-1 flex flex-col"><ExploreView /></view>}
          {tab === 'chat' && <view key="chat-tab" className="flex-1 flex flex-col"><ChatView /></view>}
        </view>

        <view className="h-16 bg-black/40 flex flex-row border-t border-white/10">
          <TabButton active={tab === 'home'} label="Home" onClick={() => setTab('home')} />
          <TabButton active={tab === 'explore'} label="Explore" onClick={() => setTab('explore')} />
          <TabButton active={tab === 'chat'} label="Chat" onClick={() => setTab('chat')} />
        </view>
      </BackgroundWrapper>

      <OverlayContainer />
    </view>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
