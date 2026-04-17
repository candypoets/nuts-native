import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';

function Page() {
  const globalProps = (typeof lynx !== 'undefined' ? lynx.__globalProps : {}) as Record<string, unknown>;
  const tag = String(globalProps.tag ?? '');

  return (
    <PageShell title="Tag">
      <view className="mt-4">
        <text className="text-white text-xl font-bold">#{tag}</text>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
