import { useState } from 'react';
import { view, text } from '@lynx-js/react';

export function PollCard({
  note,
}: {
  note: { content(): string; tags(): string[][] };
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const content = note.content();
  const tags = note.tags();

  const options = tags
    .filter((tag) => tag[0] === 'poll_option')
    .map((tag, idx) => ({
      index: tag[1] ?? String(idx),
      text: tag[2] ?? '',
    }));

  return (
    <view className="w-full flex flex-col gap-3 py-2">
      <text className="text-white text-base font-medium">{content}</text>
      <view className="flex flex-col gap-2">
        {options.map((opt, idx) => (
          <view
            key={idx}
            className={`px-4 py-3 rounded-xl border ${
              selected === idx ? 'bg-white/10' : ''
            }`}
            style={
              selected === idx
                ? { borderColor: 'var(--primary)' }
                : { borderColor: 'rgba(255,255,255,0.2)' }
            }
            catchtap={() => setSelected(idx)}
          >
            <text className="text-white/90 text-sm">{opt.text}</text>
          </view>
        ))}
      </view>
      <view
        className="mt-2 px-4 py-3 rounded-xl flex items-center justify-center"
        style={
          selected === null
            ? { backgroundColor: 'rgba(255,255,255,0.1)' }
            : { backgroundColor: 'var(--primary)' }
        }
        catchtap={() => {
          if (selected !== null) {
            console.log('Vote for option', selected);
          }
        }}
      >
        <text
          className={`text-sm font-medium ${
            selected === null ? 'text-white/40' : 'text-white'
          }`}
        >
          Vote
        </text>
      </view>
    </view>
  );
}
