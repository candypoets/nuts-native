import { useState, useEffect, useCallback } from 'react';
import * as storage from './storage';

const THEME_KEY = 'theme';

export function useThemeStore() {
	const [theme, setThemeState] = useState('matteblack');
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		storage.getItem(THEME_KEY).then((value) => {
			if (value) {
				setThemeState(value);
				if (typeof document !== 'undefined') {
					document.documentElement?.setAttribute?.('data-theme', value);
				}
			} else {
				if (typeof document !== 'undefined') {
					document.documentElement?.setAttribute?.('data-theme', 'matteblack');
				}
			}
			setLoaded(true);
		});
	}, []);

	const setTheme = useCallback((value: string) => {
		setThemeState(value);
		storage.setItem(THEME_KEY, value);
		if (typeof document !== 'undefined') {
			document.documentElement?.setAttribute?.('data-theme', value);
		}
	}, []);

	return { theme, setTheme, loaded };
}
