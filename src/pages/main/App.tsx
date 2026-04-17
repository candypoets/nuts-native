import '../../app.css';
import { useEffect, useState } from 'react';
import { view, text } from '@lynx-js/react';
import { StoreProvider, useStores } from '../../stores/StoreContext.js';
import { getManager } from '../../lib/nipworker-mock.js';
import { go } from '../../lib/navigation.js';
import { HomeView } from './HomeView';
import { ExploreView } from './ExploreView';
import { ChatView } from './ChatView';

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
