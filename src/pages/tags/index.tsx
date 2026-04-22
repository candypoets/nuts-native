// Original: /root/code/nuts-cash/src/routes/_kinds/tags.svelte
// Note: Also used for hashtag display in explore feed
import { useState, useEffect } from 'react';
import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { getItem, setItem } from '../../stores/storage.js';

function Page() {
  const [tag, setTag] = useState('');

  useEffect(() => {
    // sparkling-navigation drops custom params, so we read the payload
    // from storage written by go() in navigation.ts.
    getItem('__nav_params')
      .then((json) => {
        if (json) {
          try {
            const params = JSON.parse(json);
            setTag(String(params.tag ?? ''));
          } catch {
            // ignore parse errors
          }
          // Clear after reading to avoid stale data on back-navigation
          setItem('__nav_params', '').catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PageShell title="Tag">
      <view className="mt-4">
        <text className="text-white text-xl font-bold">#{tag}</text>
      </view>
    </PageShell>
  );
}

root.render(<Page />);
