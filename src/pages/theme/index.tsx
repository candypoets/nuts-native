import { root, view, text } from '@lynx-js/react';
import { PageShell } from '../../components/PageShell.js';
import { goBack } from '../../lib/navigation.js';
import { useThemeStore } from '../../stores/useThemeStore.js';

const themes = ['touchgrass', 'nightsky', 'matteblack', 'snowwhite', 'downfox', 'sunset'];

function Page() {
  const { theme, setTheme } = useThemeStore();

  return (
    <PageShell title="Theme">
      <view className="px-4 mt-4 space-y-2">
        {themes.map((t) => {
          const isActive = theme === t;
          const color = t === 'snowwhite' ? '#f9fafb' : t === 'sunset' ? '#f4e4bc' : '#131716';
          return (
            <view
              key={t}
              className="py-4 px-4 bg-white/5 rounded-xl flex flex-row items-center justify-between"
              bindtap={() => setTheme(t)}
            >
              <text className="text-white font-medium capitalize">{t}</text>
              <view className="flex flex-row items-center gap-2">
                <view className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: color }} />
                {isActive && <text className="text-accent text-sm">✓</text>}
              </view>
            </view>
          );
        })}
      </view>
    </PageShell>
  );
}

root.render(<Page />);
