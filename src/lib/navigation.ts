import { navigate as sparklingNavigate, close as sparklingClose } from 'sparkling-navigation';

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
	sparklingNavigate(
		{
			path,
			options: {
				params,
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
