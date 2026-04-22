import { view, text, scrollView } from '@lynx-js/react';
import { ReactNode, useState, useEffect } from 'react';
import { goBack } from '../lib/navigation.js';

/**
 * ModalOverlay - A modal-style overlay that slides up from bottom
 * with background dimming and scaling.
 * 
 * Mimics nuts-cash's modal animation (data-kind="modal"):
 * - Modal slides up from bottom
 * - Background scales down slightly and dims
 */
export function ModalOverlay({
  isOpen,
  title,
  children,
  onClose,
}: {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setAnimating(true);
      // Animation completes after 300ms
      const timer = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timer);
    } else {
      setAnimating(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  // Animation styles
  const overlayStyle = {
    transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
    opacity: isOpen ? 1 : 0,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
  };

  const backdropStyle = {
    opacity: isOpen ? 1 : 0,
    transition: 'opacity 0.3s ease-out',
  };

  return (
    <view
      className="fixed inset-0 z-50"
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      {/* Backdrop - dims the content behind */}
      <view
        className="absolute inset-0 bg-black/50"
        style={backdropStyle}
        bindtap={onClose}
      />

      {/* Modal content - slides up from bottom */}
      <view
        className="absolute bottom-0 left-0 right-0 bg-basic rounded-t-3xl max-h-[90vh]"
        style={overlayStyle}
      >
        {/* Handle bar */}
        <view className="w-full flex justify-center pt-3 pb-1">
          <view className="w-12 h-1 bg-white/30 rounded-full" />
        </view>

        {/* Header */}
        {title && (
          <view className="flex items-center justify-between px-4 h-14 border-b border-white/10">
            <view bindtap={onClose}>
              <text className="text-white text-xl">✕</text>
            </view>
            <text className="text-white text-lg font-semibold">{title}</text>
            <view className="w-8" />
          </view>
        )}

        {/* Content */}
        <scrollView className="max-h-[calc(90vh-60px)]">
          <view className="p-4">{children}</view>
        </scrollView>
      </view>
    </view>
  );
}

/**
 * SubOverlay - A sub-page overlay that slides in from right
 * 
 * Mimics nuts-cash's sub animation (data-kind="sub"):
 * - Page slides in from right
 * - Previous page stays visible, slightly dimmed
 */
export function SubOverlay({
  isOpen,
  children,
  onClose,
}: {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  const slideStyle = {
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-out',
  };

  return (
    <view className="fixed inset-0 z-50 overflow-hidden">
      {/* Content slides in from right */}
      <view
        className="absolute inset-0 bg-basic mobile-height"
        style={slideStyle}
      >
        {children}
      </view>
    </view>
  );
}

/**
 * useModalAnimation - Hook to animate background content when modal opens
 * 
 * Usage in parent component:
 * const { backgroundStyle } = useModalAnimation(isModalOpen);
 * 
 * Then apply backgroundStyle to your main content container
 */
export function useModalAnimation(isModalOpen: boolean) {
  const backgroundStyle = {
    transform: isModalOpen ? 'scale(0.95)' : 'scale(1)',
    opacity: isModalOpen ? 0.5 : 1,
    transition: 'transform 0.3s ease-out, opacity 0.3s ease-out',
    borderRadius: isModalOpen ? '16px' : '0',
    overflow: 'hidden' as const,
  };

  return { backgroundStyle };
}
