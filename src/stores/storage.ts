import { getItem as sparklingGet, setItem as sparklingSet } from 'sparkling-storage';

export async function getItem(key: string): Promise<string | null> {
	try {
		return await sparklingGet(key);
	} catch {
		if (typeof localStorage !== 'undefined') {
			return localStorage.getItem(key);
		}
	}
	return null;
}

export async function setItem(key: string, value: string): Promise<void> {
	try {
		await sparklingSet(key, value);
	} catch {
		if (typeof localStorage !== 'undefined') {
			localStorage.setItem(key, value);
		}
	}
}
