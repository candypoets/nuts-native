import { view, text, scrollView, image } from '@lynx-js/react';
import { useStores } from '../../stores/StoreContext.js';
import { EmptyWallet } from '../../components/EmptyWallet.js';
import { go } from '../../lib/navigation.js';

export function HomeView() {
	const { key, unreadCount } = useStores();
	const hasWallet = false;
	const walletItems: any[] = [];

	return (
		<scrollView className="flex-1 bg-base-300 bg-opacity-85">
			<view className="w-feed px-1">
				{/* Header */}
				<view className="relative pt-4 place-content-center m-auto z-10">
					<view className="flex justify-between lg:m-auto h-16 items-center px-2">
						<text className="text-2xl font-semibold text-white">Home</text>
						<view className="flex gap-3 items-center">
							<view bindtap={() => go('qr')}>
								<text className="text-2xl">🔲</text>
							</view>
							<view className="relative" bindtap={() => go('profile')}>
								<image
									src="asset:///miss-profile.png"
									className="w-8 h-8 rounded-full border border-white/20"
								/>
								{unreadCount > 0 && (
									<view className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
								)}
							</view>
						</view>
					</view>

					{/* Action Buttons */}
					<view className="flex lg:gap-8 gap-4 px-4 py-2 mt-2 w-feed m-auto">
						<view className="text-center" bindtap={() => go('receive')}>
							<view className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
								<text className="text-2xl text-white">＋</text>
							</view>
							<text className="text-sm mt-1 font-semibold text-white">Receive</text>
						</view>
						<view className="text-center" bindtap={() => go('send')}>
							<view className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
								<text className="text-2xl text-white">→</text>
							</view>
							<text className="text-sm mt-1 font-semibold text-white">Send</text>
						</view>
						<view className="text-center" bindtap={() => go('scan')}>
							<view className="w-14 h-14 rounded-full border border-white/30 flex items-center justify-center">
								<text className="text-2xl text-white">📷</text>
							</view>
							<text className="text-sm mt-1 font-semibold text-white">Scan</text>
						</view>
						<view className="flex-grow w-1/4" />
					</view>
				</view>

				{/* Content */}
				<view className="mt-4 px-2 pb-8">
					{!key?.pub ? (
						<view className="py-8">
							<text className="text-white text-center">Connect your Nostr key to see your wallet</text>
							<view className="mt-4 mx-auto px-6 py-3 bg-accent rounded-xl w-fit" bindtap={() => go('login')}>
								<text className="text-white font-semibold">Login</text>
							</view>
						</view>
					) : walletItems.length === 0 ? (
						<EmptyWallet hasWallet={hasWallet} />
					) : (
						<view className="py-8">
							<text className="text-white text-center">Wallet feed coming soon</text>
						</view>
					)}
				</view>
			</view>
		</scrollView>
	);
}
