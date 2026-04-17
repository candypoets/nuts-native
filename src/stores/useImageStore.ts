import { useState, useCallback } from 'react';

export function useImageStore() {
	const [zoomed, setZoomed] = useState<number | undefined>(undefined);
	const [links, setLinks] = useState<any[]>([]);
	const [note, setNote] = useState<any>(null);
	const [context, setContext] = useState<any[]>([]);
	const [gridId, setGridId] = useState('');
	const [videoTime, setVideoTime] = useState(0);
	const [sharedVideoElement, setSharedVideoElement] = useState<any>(null);
	const [sharedVideoIndex, setSharedVideoIndex] = useState(0);
	const [sharedVideoGridId, setSharedVideoGridId] = useState('');

	return {
		zoomed, setZoomed,
		links, setLinks,
		note, setNote,
		context, setContext,
		gridId, setGridId,
		videoTime, setVideoTime,
		sharedVideoElement, setSharedVideoElement,
		sharedVideoIndex, setSharedVideoIndex,
		sharedVideoGridId, setSharedVideoGridId,
	};
}
