import { useState, useCallback } from 'react';

export type NostrStores = {
	kind0: any;
	kind3: any;
	kind10002: any;
	kind10000: any;
	kind10019: any;
	kind10063: any;
	kind10096: any;
};

export function useNostrStore() {
	const [kind0, setKind0] = useState<any>(null);
	const [parsedKind0, setParsedKind0] = useState<{ name?: string; about?: string; picture?: string; banner?: string; nip05?: string; lud16?: string; website?: string } | null>(null);
	const [kind3, setKind3] = useState<any>(null);
	const [kind10002, setKind10002] = useState<any>(null);
	const [kind10000, setKind10000] = useState<any>(null);
	const [kind10019, setKind10019] = useState<any>(null);
	const [kind10063, setKind10063] = useState<any>(null);
	const [kind10096, setKind10096] = useState<any>(null);

	const [kind0Ready, setKind0Ready] = useState(false);
	const [kind3Ready, setKind3Ready] = useState(false);
	const [kind10002Ready, setKind10002Ready] = useState(false);
	const [kind10000Ready, setKind10000Ready] = useState(false);
	const [kind10019Ready, setKind10019Ready] = useState(false);
	const [kind10063Ready, setKind10063Ready] = useState(false);
	const [kind10096Ready, setKind10096Ready] = useState(false);

	const resolveKind0 = useCallback((value: any) => {
		setKind0(value);
		setKind0Ready(true);
		if (value && typeof value.content === 'function') {
			try {
				const parsed = JSON.parse(value.content());
				setParsedKind0(parsed);
			} catch {
				setParsedKind0(null);
			}
		} else if (value && typeof value.content === 'string') {
			try {
				const parsed = JSON.parse(value.content);
				setParsedKind0(parsed);
			} catch {
				setParsedKind0(null);
			}
		}
	}, []);
	const resolveKind3 = useCallback((value: any) => { setKind3(value); setKind3Ready(true); }, []);
	const resolveKind10002 = useCallback((value: any) => { setKind10002(value); setKind10002Ready(true); }, []);
	const resolveKind10000 = useCallback((value: any) => { setKind10000(value); setKind10000Ready(true); }, []);
	const resolveKind10019 = useCallback((value: any) => { setKind10019(value); setKind10019Ready(true); }, []);
	const resolveKind10063 = useCallback((value: any) => { setKind10063(value); setKind10063Ready(true); }, []);
	const resolveKind10096 = useCallback((value: any) => { setKind10096(value); setKind10096Ready(true); }, []);

	return {
		kind0, setKind0, kind0Ready, resolveKind0,
		parsedKind0,
		kind3, setKind3, kind3Ready, resolveKind3,
		kind10002, setKind10002, kind10002Ready, resolveKind10002,
		kind10000, setKind10000, kind10000Ready, resolveKind10000,
		kind10019, setKind10019, kind10019Ready, resolveKind10019,
		kind10063, setKind10063, kind10063Ready, resolveKind10063,
		kind10096, setKind10096, kind10096Ready, resolveKind10096,
	};
}
