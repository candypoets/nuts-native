import { view, image } from '@lynx-js/react';

export function ImageGrid({
  urls,
  onImageTap,
}: {
  urls: string[];
  onImageTap?: (index: number) => void;
}) {
  const count = urls.length;
  if (count === 0) return null;

  if (count === 1) {
    return (
      <view className="w-full mt-2" style={{ aspectRatio: '4/3' }}>
        <image
          src={urls[0]}
          className="w-full h-full rounded-lg"
          style={{ objectFit: 'cover' }}
          bindtap={() => onImageTap?.(0)}
        />
      </view>
    );
  }

  if (count === 2) {
    return (
      <view className="w-full mt-2 flex flex-row" style={{ gap: '2px' }}>
        {urls.map((url, idx) => (
          <view key={idx} className="flex-1" style={{ aspectRatio: '1/1' }}>
            <image
              src={url}
              className="w-full h-full rounded-lg"
              style={{ objectFit: 'cover' }}
              bindtap={() => onImageTap?.(idx)}
            />
          </view>
        ))}
      </view>
    );
  }

  if (count === 3) {
    return (
      <view className="w-full mt-2 flex flex-col" style={{ gap: '2px' }}>
        <view style={{ aspectRatio: '16/9' }}>
          <image
            src={urls[0]}
            className="w-full h-full rounded-lg"
            style={{ objectFit: 'cover' }}
            bindtap={() => onImageTap?.(0)}
          />
        </view>
        <view className="flex flex-row" style={{ gap: '2px' }}>
          {urls.slice(1).map((url, idx) => (
            <view key={idx + 1} className="flex-1" style={{ aspectRatio: '1/1' }}>
              <image
                src={url}
                className="w-full h-full rounded-lg"
                style={{ objectFit: 'cover' }}
                bindtap={() => onImageTap?.(idx + 1)}
              />
            </view>
          ))}
        </view>
      </view>
    );
  }

  // 4+ images: 2-column grid, show all images
  const rows: string[][] = [];
  for (let i = 0; i < urls.length; i += 2) {
    rows.push(urls.slice(i, i + 2));
  }
  return (
    <view className="w-full mt-2 flex flex-col" style={{ gap: '2px' }}>
      {rows.map((row, rowIdx) => (
        <view key={rowIdx} className="flex flex-row" style={{ gap: '2px' }}>
          {row.map((url, colIdx) => {
            const idx = rowIdx * 2 + colIdx;
            return (
              <view key={idx} className="flex-1" style={{ aspectRatio: '1/1' }}>
                <image
                  src={url}
                  className="w-full h-full rounded-lg"
                  style={{ objectFit: 'cover' }}
                  bindtap={() => onImageTap?.(idx)}
                />
              </view>
            );
          })}
        </view>
      ))}
    </view>
  );
}
