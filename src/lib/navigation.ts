import { navigate as sparklingNavigate, close as sparklingClose } from 'sparkling-navigation';
import { setItem } from '../stores/storage.js';

// Page types matching nuts-cash PagerAnimator's data-kind system
// - 'sub': Pages that push in from the right (stack-based navigation)
// - 'modal': Pages that slide up from the bottom (overlay navigation)
export type PageKind = 'sub' | 'modal';

// All available pages
export const pathOptions = [
	'receive', 'send', 'scan', 'qr', 'ecash', 'cmdk', 'followlists', 'kind1111',
	'lightning', 'login', 'minting', 'minted', 'melt', 'melted', 'newchat', 'tapcash',
	'profile', 'zaps', 'keys', 'wallet', 'post', 'reply', 'repost', 'relays',
	'relayinfos', 'share', 'logout', 'theme', 'zoom', 'kind0', 'tags', 'note'
];

// Pages that require login
export const pathNeedsLogin = [
	'receive', 'send', 'ecash', 'lightning', 'kind0', 'minting', 'minted',
	'melt', 'melted', 'newchat', 'notifications', 'tapcash', 'profile', 'zaps',
	'keys', 'wallet', 'post', 'reply', 'repost', 'relays', 'share', 'logout'
];

// Page kind classification (matches nuts-cash's data-kind attribute behavior)
// Modals: overlay-style pages (slide up from bottom)
// Subs: stack-style pages (push from right)
export const modalPages = new Set<string>([
	// Profile modals (from nuts-cash modals/_profile/)
	'profile', 'keys', 'kind0', 'wallet', 'relays', 'logout',
	// Payment modals (from nuts-cash modals/)
	'send', 'receive', 'minting', 'minted', 'melt', 'melted', 'tapcash', 'ecash', 'lightning',
	// Post/composer modals
	'post', 'reply', 'repost', 'share',
	// QR/Scan modals
	'qr', 'scan',
	// Other overlay modals
	'cmdk', 'followlists', 'newchat', 'kind1111', 'zaps', 'theme', 'zoom'
]);

// Sub pages: navigation within the content hierarchy (push from right)
export const subPages = new Set<string>([
	// Content navigation
	'note', 'user', 'tags',
	// Auth flow (treated as sub-navigation)
	'login',
	// Info pages
	'relayinfos'
]);

/**
 * Get the page kind (modal or sub) for a given path.
 * Defaults to 'modal' if not explicitly categorized.
 */
export function getPageKind(path: string): PageKind {
	// Extract base path without query params
	const basePath = path.split('?')[0].split(':')[0];
	if (subPages.has(basePath)) return 'sub';
	if (modalPages.has(basePath)) return 'modal';
	// Default to modal for unclassified pages (safer for mobile UX)
	return 'modal';
}

/**
 * Navigate to a page with automatic animation type detection.
 * Uses 'sub' kind (push right) for content navigation, 'modal' kind (slide up) for overlays.
 */
export function go(path: string, params?: Record<string, unknown>) {
	const kind = getPageKind(path);
	return navigateWithKind(path, kind, params);
}

/**
 * Navigate as a 'sub' page - pushes in from the right (stack navigation).
 * Used for: note detail, user profiles, hashtag feeds - content hierarchy navigation.
 * Equivalent to nuts-cash's data-kind="sub" in PagerAnimator.
 */
export function goSub(path: string, params?: Record<string, unknown>) {
	return navigateWithKind(path, 'sub', params);
}

/**
 * Navigate as a 'modal' page - slides up from the bottom (overlay navigation).
 * Used for: composers, payments, settings, profile modals - overlay interactions.
 * Equivalent to nuts-cash's data-kind="modal" in PagerAnimator.
 */
export function goModal(path: string, params?: Record<string, unknown>) {
	return navigateWithKind(path, 'modal', params);
}

/**
 * Core navigation function with explicit page kind.
 * The kind parameter determines the native animation style.
 */
function navigateWithKind(
	path: string,
	kind: PageKind,
	params?: Record<string, unknown>
) {
	if (params) {
		// sparkling-navigation only allows a fixed allowlist of scheme params,
		// so custom keys are discarded. We stash the payload in sparkling-storage
		// so the destination page can read it back on mount.
		setItem('__nav_params', JSON.stringify({ ...params, __kind: kind })).catch(() => {});
	}

	// Store navigation metadata for the destination page to read
	setItem('__nav_meta', JSON.stringify({ kind, timestamp: Date.now() })).catch(() => {});

	sparklingNavigate(
		{
			path,
			options: {
				animated: true,
				// Note: Sparkling doesn't natively support different animation types yet.
				// We store the kind in navigation metadata so native code could
				// potentially use it in the future via a custom router interceptor.
				extra: { __pageKind: kind }
			},
		},
		() => {}
	);
}

export function goBack(animated = true) {
	sparklingClose({ animated });
}

export function goToRoot() {
	sparklingClose({ animated: true });
}

/**
 * Read the page kind from navigation metadata.
 * Call this on page mount to determine your animation/transition style.
 */
export async function getNavigationKind(): Promise<PageKind | null> {
	try {
		const { getItem } = await import('../stores/storage.js');
		const meta = await getItem('__nav_meta');
		if (meta) {
			const parsed = JSON.parse(meta);
			return parsed.kind || null;
		}
	} catch {
		// ignore
	}
	return null;
}
