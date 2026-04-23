/**
 * Sparkling polyfill for Lynx Explorer preview
 *
 * Sparkling native modules (spkPipe) are not available in Lynx Explorer.
 * This wraps NativeModules with a Proxy so sparkling-navigation/storage
 * calls succeed gracefully instead of crashing.
 */

// In-memory storage for the polyfill (shared across the JS context)
const memoryStore = new Map<string, string>();

const mockSpkPipe = {
	call(method: string, payload: any, callback: (v: any) => void) {
		const { data } = payload ?? {};

		switch (method) {
			case 'router.open': {
				console.log('[ExplorerPolyfill] router.open:', data?.scheme ?? data);
				if (typeof callback === 'function') {
					callback({ code: 1, msg: 'ok' });
				}
				return;
			}
			case 'router.close': {
				console.log('[ExplorerPolyfill] router.close');
				if (typeof callback === 'function') {
					callback({ code: 1, msg: 'ok' });
				}
				return;
			}
			case 'storage.setItem': {
				if (data?.key !== undefined) {
					memoryStore.set(data.key, String(data.data ?? ''));
				}
				if (typeof callback === 'function') {
					callback({ code: 1, msg: 'ok' });
				}
				return;
			}
			case 'storage.getItem': {
				const value = data?.key ? memoryStore.get(data.key) ?? null : null;
				if (typeof callback === 'function') {
					callback({ code: 1, msg: 'ok', data: value });
				}
				return;
			}
			default: {
				console.log('[ExplorerPolyfill] unhandled spkPipe call:', method, data);
				if (typeof callback === 'function') {
					callback({ code: 1, msg: 'ok' });
				}
			}
		}
	},
};

function patchNativeModules(): void {
	// @ts-ignore
	if (typeof NativeModules === 'undefined') {
		return;
	}
	// @ts-ignore
	if (NativeModules['spkPipe']) {
		// Already has spkPipe — real Sparkling build, skip
		return;
	}

	// Wrap NativeModules with a Proxy so property reads for 'spkPipe'
	// return our mock without mutating the HostObject itself.
	// @ts-ignore
	const original = NativeModules;
	// @ts-ignore
	globalThis.NativeModules = new Proxy(original, {
		get(target, prop, receiver) {
			if (prop === 'spkPipe') {
				return mockSpkPipe;
			}
			return Reflect.get(target, prop, receiver);
		},
	});

	console.log('[ExplorerPolyfill] NativeModules wrapped for Lynx Explorer');
}

patchNativeModules();
