import { useState, useEffect } from 'react';

export function useViewportStore() {
	const [dimensions, setDimensions] = useState({ width: 375, height: 812 });

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const update = () => {
				setDimensions({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			};
			update();
			window.addEventListener('resize', update);
			return () => window.removeEventListener('resize', update);
		}
	}, []);

	const vw = dimensions.width * 0.01;
	const vh = dimensions.height * 0.01;
	const isMobile = dimensions.width <= 768;

	return { dimensions, vw, vh, isMobile };
}
