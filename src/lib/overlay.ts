import { useState, useCallback, useEffect } from 'react';

/**
 * Stacked Overlay System - Multiple overlays on screen with depth-based animations
 * 
 * Unlike the original single-overlay system, this supports stacking:
 * - Modal on top of modal (payment flow within composer)
 * - Sub on top of modal (note detail from composer)
 * - Mixed stacking with depth-based background effects
 * 
 * Each overlay in the stack gets its own depth level, and the background
 * animates progressively (more scale, more dim) as the stack grows.
 */

export type OverlayType = 'modal' | 'sub';

interface OverlayItem {
  id: string;
  component: string;
  type: OverlayType;
  params?: Record<string, unknown>;
  isOpen: boolean;
}

type OverlayStack = OverlayItem[];

// Global overlay stack (singleton)
let overlayListeners: ((stack: OverlayStack) => void)[] = [];
let overlayStack: OverlayStack = [];
let idCounter = 0;

function generateId(): string {
  return `overlay-${++idCounter}-${Date.now()}`;
}

function notifyListeners() {
  overlayListeners.forEach(listener => listener([...overlayStack]));
}

/**
 * Push a new overlay onto the stack
 */
export function pushOverlay(
  component: string,
  type: OverlayType = 'modal',
  params?: Record<string, unknown>
): string {
  const id = generateId();
  
  // Mark all existing overlays as "behind" (they scale down more)
  overlayStack = overlayStack.map(item => ({ ...item, isOpen: false }));
  
  // Add new overlay on top
  overlayStack = [...overlayStack, { id, component, type, params, isOpen: true }];
  
  notifyListeners();
  return id;
}

/**
 * Pop the top overlay from the stack
 */
export function popOverlay(): boolean {
  if (overlayStack.length === 0) return false;
  
  // Mark top overlay as closing
  const newStack = [...overlayStack];
  const topIndex = newStack.length - 1;
  newStack[topIndex] = { ...newStack[topIndex], isOpen: false };
  overlayStack = newStack;
  notifyListeners();
  
  // After animation, remove from stack and restore previous
  setTimeout(() => {
    overlayStack = overlayStack.slice(0, -1);
    if (overlayStack.length > 0) {
      // Restore the new top overlay to "open" state
      const lastIndex = overlayStack.length - 1;
      overlayStack = overlayStack.map((item, i) => 
        i === lastIndex ? { ...item, isOpen: true } : item
      );
    }
    notifyListeners();
  }, 300);
  
  return true;
}

/**
 * Close all overlays at once
 */
export function closeAllOverlays(): void {
  if (overlayStack.length === 0) return;
  
  // Mark all as closing
  overlayStack = overlayStack.map(item => ({ ...item, isOpen: false }));
  notifyListeners();
  
  // Clear after animation
  setTimeout(() => {
    overlayStack = [];
    notifyListeners();
  }, 300);
}

/**
 * Get current stack depth (number of open overlays)
 */
export function getOverlayDepth(): number {
  return overlayStack.length;
}

/**
 * Check if any overlay is open
 */
export function hasOpenOverlays(): boolean {
  return overlayStack.length > 0 && overlayStack.some(item => item.isOpen);
}

/**
 * Subscribe to overlay stack changes
 */
export function subscribeToOverlays(callback: (stack: OverlayStack) => void): () => void {
  overlayListeners.push(callback);
  callback([...overlayStack]); // Initial call
  return () => {
    overlayListeners = overlayListeners.filter(l => l !== callback);
  };
}

/**
 * Hook to use the overlay stack in components
 */
export function useOverlayStack() {
  const [stack, setStack] = useState<OverlayStack>([]);

  useEffect(() => {
    return subscribeToOverlays(setStack);
  }, []);

  const push = useCallback((component: string, type: OverlayType = 'modal', params?: Record<string, unknown>) => {
    return pushOverlay(component, type, params);
  }, []);

  const pop = useCallback(() => {
    return popOverlay();
  }, []);

  const closeAll = useCallback(() => {
    closeAllOverlays();
  }, []);

  const depth = stack.length;
  const topOverlay = depth > 0 ? stack[depth - 1] : null;

  return {
    stack,
    pushOverlay: push,
    popOverlay: pop,
    closeAllOverlays: closeAll,
    depth,
    topOverlay,
    hasOverlays: depth > 0,
  };
}

/**
 * Convenience functions
 */
export function pushModal(component: string, params?: Record<string, unknown>): string {
  return pushOverlay(component, 'modal', params);
}

export function pushSub(component: string, params?: Record<string, unknown>): string {
  return pushOverlay(component, 'sub', params);
}

/**
 * Animation configuration with depth support
 * 
 * Each depth level gets progressively more dimmed/scaled
 */
export const overlayAnimations = {
  modal: {
    overlay: {
      in: { opacity: 1 },
      out: { opacity: 0 },
      transition: 'opacity 0.3s ease-out',
    },
  },
  sub: {
    overlay: {
      in: { opacity: 1 },
      out: { opacity: 0 },
      transition: 'opacity 0.3s ease-out',
    },
  },
};

/**
 * Calculate background animation based on overlay depth
 * 
 * Each overlay in the stack adds to the effect:
 * - Scale: 1 → 0.95 → 0.90 → 0.85 (each level -0.05)
 * - Opacity: 1 → 0.5 → 0.3 → 0.2 (progressive dimming)
 * - TranslateX: 0 → -20% → -35% → -45% (progressive slide)
 */
export function getBackgroundStyles(depth: number, topType: OverlayType = 'modal'): React.CSSProperties {
  const maxDepth = Math.min(depth, 4); // Cap at 4 levels
  const opacity = Math.max(0.15, 1 - maxDepth * 0.35);

  return {
    opacity,
    transition: 'opacity 0.3s ease-out',
    overflow: 'hidden',
  };
}

/**
 * Calculate individual overlay styles based on its position in stack
 * 
 * Each overlay gets slight offset to show depth:
 * - Modal stack: slight Y offset, scale differences
 * - Sub stack: slight X offset for stacking effect
 */
export function getOverlayStyles(
  item: OverlayItem, 
  index: number, 
  totalDepth: number
): React.CSSProperties {
  const anim = overlayAnimations[item.type];
  const isTop = index === totalDepth - 1;
  
  // Base animation
  const baseStyle = item.isOpen ? anim.overlay.in : anim.overlay.out;
  
  // Stacked effect for non-top items
  const stackOffset = isTop ? 0 : (totalDepth - index - 1) * 4; // 4px per level behind
  
  return {
    ...baseStyle,
    opacity: item.isOpen ? 1 : 0,
    transition: anim.overlay.transition,
    zIndex: 50 + index,
  };
}

/**
 * Get backdrop opacity based on stack depth
 * Deeper stacks = darker backdrop
 */
export function getBackdropStyles(depth: number): React.CSSProperties {
  const maxDepth = Math.min(depth, 4);
  const opacity = Math.min(0.7, 0.3 + maxDepth * 0.1); // 0.3, 0.4, 0.5, 0.6, 0.7
  
  return {
    opacity,
    transition: 'opacity 0.3s ease-out',
  };
}
