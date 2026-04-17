import { navigate as sparklingNavigate, close as sparklingClose } from 'sparkling-navigation';
import { setItem } from '../stores/storage.js';

export const pathOptions = [
	'receive', 'send', 'scan', 'qr', 'ecash', 'cmdk', 'followlists', 'kind1111',
	'lightning', 'login', 'minting', 'minted', 'melt', 'melted', 'newchat', 'tapcash',
	'profile', 'zaps', 'keys', 'wallet', 'post', 'reply', 'repost', 'relays',
	'relayinfos', 'share', 'logout', 'theme', 'zoom', 'kind0', 'tags'
];

export const pathNeedsLogin = [
	'receive', 'send', 'ecash', 'lightning', 'kind0', 'minting', 'minted',
	'melt', 'melted', 'newchat', 'notifications', 'tapcash', 'profile', 'zaps',
	'keys', 'wallet', 'post', 'reply', 'repost', 'relays', 'share', 'logout'
];

export function go(path: string, params?: Record<string, unknown>) {
	if (params) {
		// sparkling-navigation only allows a fixed allowlist of scheme params,
		// so custom keys are discarded. We stash the payload in sparkling-storage
		// so the destination page can read it back on mount.
		setItem('__nav_params', JSON.stringify(params)).catch(() => {});
	}
	sparklingNavigate(
		{
			path,
			options: {
				animated: true,
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
