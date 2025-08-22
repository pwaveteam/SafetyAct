// tailwind.config.js
module.exports = {
content: [
"./index.html",
"./src/**/*.{js,ts,jsx,tsx}",
"node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}"
],
theme: {
extend: {
fontFamily: {
sans: ['Pretendard', 'sans-serif'],
},
fontSize: {
base: ['0.9375rem', { lineHeight: '1.5rem' }],
},
},
},
plugins: [require('flowbite/plugin')],
}