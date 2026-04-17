import { root } from '@lynx-js/react';
import { view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { useStores } from '../../stores/StoreContext.js';
import { go } from '../../lib/navigation.js';

function Page() {
  const { setKey, setMnemonic, setPassphrase } = useStores();

  function handleLogout() {
    setKey({ pub: '', npub: '' });
    setMnemonic('');
    setPassphrase('');
    go('explore');
  }

  return (
    <PageShell title="Logout">
      <view className="flex flex-col gap-4 justify-center px-6 py-12">
        <view className="text-center font-semibold p-3 border border-yellow-100/30 rounded-lg flex flex-row items-center justify-center">
          <text className="text-xl mr-2">⚠️</text>
          <text className="text-white text-sm">Make sure you saved your private key before logging out</text>
        </view>
        <view
          className="w-full py-4 rounded-xl bg-accent flex items-center justify-center mt-4"
          bindtap={handleLogout}
        >
          <text className="text-white font-semibold text-lg">Log Out</text>
        </view>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
