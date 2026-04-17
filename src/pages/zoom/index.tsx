import { useState, useEffect } from 'react';
import { root, view, text, image, scrollView } from '@lynx-js/react';
import { getItem, setItem } from '../../stores/storage.js';
import { goBack } from '../../lib/navigation.js';

function Page() {
  const [params, setParams] = useState<{ url?: string; urls?: string[]; index?: number }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getItem('__nav_params')
      .then((json) => {
        if (json) {
          try {
            const parsed = JSON.parse(json);
            const urls = Array.isArray(parsed.urls) ? parsed.urls : parsed.url ? [parsed.url] : [];
            const index = typeof parsed.index === 'number' ? parsed.index : 0;
            setParams({ url: parsed.url, urls, index });
            setCurrentIndex(index);
          } catch {
            // ignore parse errors
          }
          // Clear after reading to avoid stale data on back-navigation
          setItem('__nav_params', '').catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const urls = params.urls && params.urls.length > 0 ? params.urls : params.url ? [params.url] : [];

  const goPrev = () => {
    if (urls.length > 1) {
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : urls.length - 1));
    }
  };

  const goNext = () => {
    if (urls.length > 1) {
      setCurrentIndex((prev) => (prev < urls.length - 1 ? prev + 1 : 0));
    }
  };

  const currentUrl = urls[currentIndex] || '';

  return (
    <view className="mobile-height bg-black flex flex-col">
      {/* Header */}
      <view className="flex items-center justify-between px-4 h-14 shrink-0">
        <view bindtap={goBack}>
          <text className="text-white text-xl">←</text>
        </view>
        <text className="text-white text-sm font-medium">
          {urls.length > 0 ? `${currentIndex + 1} / ${urls.length}` : ''}
        </text>
        <view className="w-8" />
      </view>

      {/* Image viewer */}
      <view className="flex-1 relative">
        {currentUrl ? (
          <scrollView
            className="w-full h-full"
            {...({ 'scroll-x': true, 'scroll-y': true } as any)}
          >
            <view
              className="flex items-center justify-center"
              style={{ width: '200vw', height: '200vh' }}
            >
              <image
                src={currentUrl}
                className="w-full h-full"
                style={{ objectFit: 'contain' }}
              />
            </view>
          </scrollView>
        ) : (
          <view className="flex items-center justify-center h-full">
            <text className="text-white/50 text-sm">No image</text>
          </view>
        )}

        {/* Navigation overlays */}
        {urls.length > 1 && (
          <>
            <view
              className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center"
              bindtap={goPrev}
            >
              <text className="text-white/70 text-3xl">←</text>
            </view>
            <view
              className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center"
              bindtap={goNext}
            >
              <text className="text-white/70 text-3xl">→</text>
            </view>
          </>
        )}
      </view>
    </view>
  );
}

root.render(<Page />);
