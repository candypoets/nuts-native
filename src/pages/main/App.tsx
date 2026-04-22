// Original: /root/code/nuts-cash/src/routes/+page.svelte (main tab container)
import '../../app.css';
import { useEffect, useState } from 'react';
import { view, text } from '@lynx-js/react';
import { StoreProvider, useStores } from '../../stores/StoreContext.js';
import { getManager } from '../../lib/nipworker-mock.js';
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
    <view className="mobile-height bg-basic flex flex-col">
      {/* 
        BackgroundWrapper animates the main content when an overlay opens.
        - For modal: scales down to 0.95 and dims
        - For sub: slides left 20%, scales to 0.95, dims slightly
      */}
      <BackgroundWrapper>
        <view className="flex-1 overflow-hidden">
          {tab === 'home' && <HomeView />}
          {tab === 'explore' && <ExploreView />}
          {tab === 'chat' && <ChatView />}
        </view>

        <view className="h-16 bg-black/40 flex flex-row border-t border-white/10">
          <TabButton active={tab === 'home'} label="Home" onClick={() => setTab('home')} />
          <TabButton active={tab === 'explore'} label="Explore" onClick={() => setTab('explore')} />
          <TabButton active={tab === 'chat'} label="Chat" onClick={() => setTab('chat')} />
        </view>
      </BackgroundWrapper>

      {/* 
        OverlayContainer renders modal/sub overlays on top.
        - Modal: slides up from bottom with handle bar
        - Sub: pushes from right with back button
      */}
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
