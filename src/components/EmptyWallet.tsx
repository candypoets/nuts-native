import { view, text } from '@lynx-js/react';
import { go } from '../lib/navigation.js';

export function EmptyWallet({ hasWallet = false }: { hasWallet?: boolean }) {
	return (
		<view className="bg-base-300 bg-opacity-85 rounded-xl p-6 shadow-widget mx-1">
			<view className="flex flex-col items-center text-center">
				<view className="mb-3">
					<view className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center">
						<text className="text-3xl">👛</text>
					</view>
				</view>

				{hasWallet ? (
					<>
						<text className="text-2xl font-semibold text-white mb-2">No activity yet</text>
						<text className="text-white/70 max-w-prose mb-4 text-sm">
							Your wallet is set up. Receive your first eCash token or scan a QR to get started.
						</text>
						<view className="w-full max-w-xl flex flex-col gap-2">
							<view className="py-3 rounded-xl bg-accent flex items-center justify-center" bindtap={() => go('receive')}>
								<text className="text-white font-semibold">Receive</text>
							</view>
							<view className="py-3 rounded-xl border border-white/20 flex items-center justify-center" bindtap={() => go('scan')}>
								<text className="text-white font-semibold">Scan QR</text>
							</view>
							<view className="py-3 rounded-xl flex items-center justify-center" bindtap={() => go('send')}>
								<text className="text-white/70 font-semibold">Send</text>
							</view>
						</view>
					</>
				) : (
					<>
						<text className="text-2xl font-semibold text-white mb-2">Set up your NutsCash wallet</text>
						<text className="text-white/70 max-w-prose mb-4 text-sm">
							Choose a mint and initialize your wallet to start receiving and sending eCash on Nostr.
						</text>
						<view className="w-full max-w-xl">
							<view className="py-3 rounded-xl bg-accent flex items-center justify-center" bindtap={() => go('wallet')}>
								<text className="text-white font-semibold">Setup Wallet</text>
							</view>
							<view className="py-3 rounded-xl flex items-center justify-center mt-2">
								<text className="text-white/70 font-semibold">Explore people and posts</text>
							</view>
						</view>
					</>
				)}
			</view>
		</view>
	);
}
