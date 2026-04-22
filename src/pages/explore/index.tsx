// Original: /root/code/nuts-cash/src/routes/explore/index.svelte (standalone page version)
// Note: Main explore feed is in src/pages/main/ExploreView.tsx
import { root } from '@lynx-js/react';
import { ExploreView } from '../main/ExploreView.js';

function Page() {
  return <ExploreView />;
}

root.render(<Page />);
