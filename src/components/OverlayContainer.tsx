import { view, text, scrollView } from '@lynx-js/react';
import { useState, useEffect } from 'react';
import {
  useOverlayStack,
  popOverlay,
  getBackgroundStyles,
  getOverlayStyles,
  getBackdropStyles,
  type OverlayItem,
  type OverlayType,
} from '../lib/overlay.js';
import { go } from '../lib/navigation.js';

// Simple component registry for overlay pages
const overlayComponents: Record<string, React.FC<{ params?: Record<string, unknown>; onClose: () => void; depth: number }>> = {
  send: SendOverlay,
  receive: ReceiveOverlay,
  post: PostOverlay,
  profile: ProfileOverlay,
  scan: ScanOverlay,
  followlists: FollowListsOverlay,
  notifications: NotificationsOverlay,
  // Add more as needed
};

function SendOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Send Money</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Send overlay content here...</text>
        
        {/* Example: nested overlay trigger */}
        <view className="mt-6 py-3 bg-white/10 rounded-xl items-center" bindtap={() => {}}>
          <text className="text-white/70 text-sm">Scan QR Code</text>
        </view>
        
        <view className="mt-4 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Confirm Send</text>
        </view>
      </view>
    </scrollView>
  );
}

function ReceiveOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Receive</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Receive overlay content...</text>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Done</text>
        </view>
      </view>
    </scrollView>
  );
}

function PostOverlay({ onClose, depth, params }: { onClose: () => void; depth: number; params?: Record<string, unknown> }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">New Post</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Post composer overlay...</text>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Post</text>
        </view>
      </view>
    </scrollView>
  );
}

function ProfileOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Profile</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Profile settings...</text>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Save</text>
        </view>
      </view>
    </scrollView>
  );
}

function ScanOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Scan QR</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <view className="mt-4 h-64 bg-black/40 rounded-xl items-center justify-center">
          <text className="text-white/50">Camera preview would appear here</text>
        </view>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Close</text>
        </view>
      </view>
    </scrollView>
  );
}

function FollowListsOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Feed Builder</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Manage your follow lists...</text>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Save</text>
        </view>
      </view>
    </scrollView>
  );
}

function NotificationsOverlay({ onClose, depth }: { onClose: () => void; depth: number }) {
  return (
    <scrollView className="h-full">
      <view className="p-4">
        <view className="flex items-center justify-between mb-4">
          <text className="text-white text-xl font-bold">Notifications</text>
          <view bindtap={onClose}>
            <text className="text-white text-xl">✕</text>
          </view>
        </view>
        <text className="text-white/70">Stack depth: {depth}</text>
        <text className="text-white/70 mt-2">Your notifications...</text>
        <view className="mt-6 py-3 bg-accent rounded-xl items-center" bindtap={onClose}>
          <text className="text-white font-semibold">Mark All Read</text>
        </view>
      </view>
    </scrollView>
  );
}

/**
 * OverlayContainer - Renders a stack of overlays with depth-based animations
 * 
 * Features:
 * - Multiple overlays stacked on screen
 * - Progressive background dimming/scaling
 * - Proper z-index ordering
 * - Tap backdrop to close top overlay only
 */
export function OverlayContainer() {
  const { stack, depth, topOverlay } = useOverlayStack();
  const [renderingStack, setRenderingStack] = useState<OverlayItem[]>([]);

  // Keep items rendered during exit animation
  useEffect(() => {
    if (stack.length > 0) {
      setRenderingStack([...stack]);
    } else {
      // Delay clearing for exit animation
      const timer = setTimeout(() => setRenderingStack([]), 300);
      return () => clearTimeout(timer);
    }
  }, [stack]);

  if (renderingStack.length === 0) return null;

  const topType = topOverlay?.type || 'modal';
  const isTopOpen = topOverlay?.isOpen ?? false;

  // Calculate backdrop opacity based on stack depth
  const backdropStyle = getBackdropStyles(depth);

  return (
    <view 
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ pointerEvents: isTopOpen ? 'auto' : 'none' }}
    >
      {/* Backdrop - closes top overlay on tap */}
      <view
        className="absolute inset-0 bg-black"
        style={backdropStyle}
        bindtap={() => {
          // Only close if tapping backdrop, not overlay content
          if (depth > 0) popOverlay();
        }}
      />

      {/* Render all overlays in the stack */}
      {renderingStack.map((item, index) => (
        <OverlayItemView
          key={item.id}
          item={item}
          index={index}
          totalDepth={renderingStack.length}
        />
      ))}
    </view>
  );
}

/**
 * Individual overlay item with proper positioning and animations
 */
function OverlayItemView({
  item,
  index,
  totalDepth,
}: {
  item: OverlayItem;
  index: number;
  totalDepth: number;
}) {
  const Component = overlayComponents[item.component];
  const isTop = index === totalDepth - 1;

  if (!Component) {
    // Fallback: navigate to page if component not registered
    if (item.isOpen) {
      go(item.component, item.params);
      popOverlay();
    }
    return null;
  }

  // Get animation styles based on position in stack
  const overlayStyle = getOverlayStyles(item, index, totalDepth);

  // Container positioning based on type
  const isModal = item.type === 'modal';
  const containerClass = isModal
    ? 'absolute bottom-0 left-0 right-0 bg-basic rounded-t-3xl max-h-[90vh] overflow-hidden'
    : 'absolute inset-0 bg-basic overflow-hidden';

  return (
    <view
      className={containerClass}
      style={{
        ...overlayStyle,
        // For stacked modals, add slight offset to show depth
        bottom: isModal && !isTop ? `${(totalDepth - index - 1) * 10}px` : undefined,
        // Full screen for subs, slight inset for stacked modals
        top: isModal && !isTop ? `${(totalDepth - index - 1) * 20}px` : undefined,
      }}
      // Prevent backdrop tap from closing when clicking overlay
      bindtap={(e: any) => {
        e.stopPropagation?.();
      }}
    >
      {/* Handle bar (only for modal) */}
      {isModal && (
        <view className="w-full flex justify-center pt-3 pb-1">
          <view className="w-12 h-1 bg-white/30 rounded-full" />
        </view>
      )}

      {/* Back button (only for non-top or sub) */}
      {!isModal && (
        <view className="absolute top-4 left-4 z-10" bindtap={popOverlay}>
          <text className="text-white text-2xl">←</text>
        </view>
      )}

      {/* Close button (for top modal) */}
      {isModal && isTop && (
        <view 
          className="absolute top-4 right-4 z-10" 
          bindtap={(e: any) => {
            e.stopPropagation?.();
            popOverlay();
          }}
        >
          <text className="text-white text-xl">✕</text>
        </view>
      )}

      {/* Render the overlay component with depth info */}
      <Component 
        params={item.params} 
        onClose={popOverlay} 
        depth={index + 1}
      />
    </view>
  );
}

/**
 * BackgroundWrapper - Wraps main content to animate it when overlays stack
 * 
 * The background animates progressively based on overlay stack depth:
 * - 1 overlay: scale 0.95, opacity 0.65
 * - 2 overlays: scale 0.90, opacity 0.30
 * - 3 overlays: scale 0.85, opacity 0.15
 */
export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { depth, topOverlay } = useOverlayStack();

  const topType = topOverlay?.type || 'modal';
  const bgStyle = getBackgroundStyles(depth, topType);

  return (
    <view
      className="w-full h-full flex flex-col"
      style={bgStyle}
    >
      {children}
    </view>
  );
}
