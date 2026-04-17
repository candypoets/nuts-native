import { createContext, useContext, ReactNode } from 'react';
import { useKeyStore, useWalletStore } from './useKeyStore';
import { useThemeStore } from './useThemeStore';
import { useViewportStore } from './useViewportStore';
import { useNostrStore } from './useNostrStore';
import { useImageStore } from './useImageStore';
import { useNotificationStore } from './useNotificationStore.js';

export const StoreContext = createContext<any>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
	const keyStore = useKeyStore();
	const walletStore = useWalletStore();
	const themeStore = useThemeStore();
	const viewportStore = useViewportStore();
	const nostrStore = useNostrStore();
	const imageStore = useImageStore();
	const notificationStore = useNotificationStore();

	return (
		<StoreContext.Provider
			value={{
				...keyStore,
				...walletStore,
				...themeStore,
				...viewportStore,
				...nostrStore,
				...imageStore,
				...notificationStore,
			}}
		>
			{children}
		</StoreContext.Provider>
	);
}

export function useStores() {
	return useContext(StoreContext);
}
