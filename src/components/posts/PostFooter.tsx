import { view, text } from '@lynx-js/react';
import { go } from '../../lib/navigation.js';

function IconReply({ className }: { className?: string }) {
	return <text className={className}>↩</text>;
}

function IconRepost({ className }: { className?: string }) {
	return <text className={className}>↻</text>;
}

function IconLike({ className, filled }: { className?: string; filled?: boolean }) {
	return <text className={className}>{filled ? '♥' : '♡'}</text>;
}

function IconShare({ className }: { className?: string }) {
	return <text className={className}>↗</text>;
}

function IconZap({ className }: { className?: string }) {
	return <text className={className}>⌁</text>;
}

export function PostFooter({
	replyCount = 0,
	repostCount = 0,
	reactionCount = 0,
	liked = false,
	onReply,
	onRepost,
	onLike,
	onShare,
	onZap,
}: {
	replyCount?: number;
	repostCount?: number;
	reactionCount?: number;
	liked?: boolean;
	onReply?: () => void;
	onRepost?: () => void;
	onLike?: () => void;
	onShare?: () => void;
	onZap?: () => void;
}) {
	return (
		<view className="flex flex-row items-center gap-4 mt-2 h-6">
			<view
				className="flex flex-row items-center gap-1"
				bindtap={() => {
					go('reply');
					onReply?.();
				}}
			>
				<IconReply className="text-white/40 text-sm" />
				{replyCount > 0 ? (
					<text className="text-xs text-white/40">{replyCount}</text>
				) : null}
			</view>

			<view
				className="flex flex-row items-center gap-1"
				bindtap={() => {
					go('repost');
					onRepost?.();
				}}
			>
				<IconRepost className="text-white/40 text-sm" />
				{repostCount > 0 ? (
					<text className="text-xs text-white/40">{repostCount}</text>
				) : null}
			</view>

			<view
				className="flex flex-row items-center gap-1"
				bindtap={() => {
					onLike?.();
				}}
			>
				<IconLike className={liked ? 'text-accent text-sm' : 'text-white/40 text-sm'} filled={liked} />
				{reactionCount > 0 ? (
					<text className={liked ? 'text-xs text-accent' : 'text-xs text-white/40'}>
						{reactionCount}
					</text>
				) : null}
			</view>

			<view
				className="flex flex-row items-center gap-1"
				bindtap={() => {
					go('share');
					onShare?.();
				}}
			>
				<IconShare className="text-white/40 text-sm" />
			</view>

			<view className="flex-1" />

			<view
				className="flex flex-row items-center gap-1"
				bindtap={() => {
					go('wallet');
					onZap?.();
				}}
			>
				<IconZap className="text-white/40 text-sm" />
			</view>
		</view>
	);
}
