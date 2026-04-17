import { useState, useEffect, useCallback } from 'react';
import * as storage from './storage';

export type Key = {
	pub: string;
	npub: string;
	priv?: string;
	nsec?: string;
	hasSigner?: boolean;
};

const KEY_STORAGE_KEY = 'key';

export function useKeyStore() {
	const [key, setKeyState] = useState<Key>({ pub: '', npub: '' });
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		storage.getItem(KEY_STORAGE_KEY).then((value) => {
			if (value) {
				try {
					setKeyState(JSON.parse(value));
				} catch {
					setKeyState({ pub: '', npub: '' });
				}
			}
			setLoaded(true);
		});
	}, []);

	const setKey = useCallback((value: Key | ((prev: Key) => Key)) => {
		setKeyState((prev) => {
			const next = typeof value === 'function' ? value(prev) : value;
			storage.setItem(KEY_STORAGE_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	return { key, setKey, loaded };
}

const WALLET_MNEMONIC_KEY = 'wallet/mnemonic';
const WALLET_MNEMONIC_INDEX_KEY = 'wallet/mnemonic_index';
const WALLET_PASSPHRASE_KEY = 'wallet/passphrase';

export function useWalletStore() {
	const [mnemonic, setMnemonicState] = useState('');
	const [mnemonicIndex, setMnemonicIndexState] = useState(0);
	const [passphrase, setPassphraseState] = useState('');
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		Promise.all([
			storage.getItem(WALLET_MNEMONIC_KEY),
			storage.getItem(WALLET_MNEMONIC_INDEX_KEY),
			storage.getItem(WALLET_PASSPHRASE_KEY),
		]).then(([m, i, p]) => {
			if (m) setMnemonicState(m);
			if (i) setMnemonicIndexState(parseInt(i, 10) || 0);
			if (p) setPassphraseState(p);
			setLoaded(true);
		});
	}, []);

	const setMnemonic = useCallback((value: string) => {
		setMnemonicState(value);
		storage.setItem(WALLET_MNEMONIC_KEY, value);
	}, []);

	const setMnemonicIndex = useCallback((value: number) => {
		setMnemonicIndexState(value);
		storage.setItem(WALLET_MNEMONIC_INDEX_KEY, String(value));
	}, []);

	const setPassphrase = useCallback((value: string) => {
		setPassphraseState(value);
		storage.setItem(WALLET_PASSPHRASE_KEY, value);
	}, []);

	return {
		mnemonic,
		mnemonicIndex,
		passphrase,
		setMnemonic,
		setMnemonicIndex,
		setPassphrase,
		loaded,
	};
}
