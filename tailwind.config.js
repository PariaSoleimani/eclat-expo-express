/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/components/**/*.{js,jsx}', './src/screens/**/*.{js,jsx}', './src/app/**/*.{js,jsx}'],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {},
	},
	plugins: [],
};
