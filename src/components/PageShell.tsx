import { view, text, scrollView } from '@lynx-js/react';
import { ReactNode } from 'react';
import { goBack } from '../lib/navigation.js';

export function PageShell({
  title,
  children,
  rightAction,
}: {
  title: string;
  children: ReactNode;
  rightAction?: ReactNode;
}) {
  return (
    <scrollView className="mobile-height bg-basic">
      <view className="min-h-screen flex flex-col">
        <view className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <view bindtap={goBack}>
            <text className="text-white text-xl">←</text>
          </view>
          <text className="text-white text-lg font-semibold">{title}</text>
          <view className="w-8 flex justify-end">
            {rightAction || <text className="text-transparent">.</text>}
          </view>
        </view>
        <view className="flex-1 p-4">
          {children}
        </view>
      </view>
    </scrollView>
  );
}
