/** @type {import('tailwindcss').Config} */
module.exports = {
	safelist: [
		'grid-cols-1',
		'grid-cols-2',
		'grid-cols-3',
		'grid-cols-4',
		'grid-cols-5',
		'grid-cols-6',
		'grid-cols-7',
		'grid-cols-8',
		'col-span-1',
		'col-span-2',
		'col-span-3',
		'col-span-4',
		'col-span-5',
		'!hidden'
	],
	content: ['./src/**/*.{tsx,ts,html}'],
	theme: {
		extend: {
			colors: {
				primary: 'var(--primary)',
				'primary-content': 'var(--primary-content)',
				secondary: 'var(--secondary)',
				'secondary-content': 'var(--secondary-content)',
				'base-100': 'var(--base-100)',
				'base-200': 'var(--base-200)',
				'base-300': 'var(--base-300)',
				accent: 'var(--accent)',
				neutral: 'var(--neutral)',
				info: 'var(--info)',
				success: 'var(--success)',
				warning: 'var(--warning)',
				error: 'var(--error)',
				highlight: 'var(--highlight)',
			},
			fontFamily: {
				sans: ["Suisse Int'l", 'ui-sans-serif', 'system-ui']
			},
			boxShadow: {
				widget:
					'0px 2px 3px 0px var(--shadow-outer-color), 0 1px 0 0 var(--shadow-inset-highlight) inset, 1px 0 0 0 var(--shadow-inset-subtle) inset, -1px 0 0 0 var(--shadow-inset-subtle) inset',
				'widget-down':
					'2px 2px 3px 0px var(--shadow-outer-color), 0 -1px 0 0 var(--shadow-inset-highlight) inset, 1px 0 0 0 var(--shadow-inset-subtle) inset, -1px 0 0 0 var(--shadow-inset-subtle) inset'
			}
		}
	},
	plugins: []
};
