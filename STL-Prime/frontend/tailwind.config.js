/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                prime: {
                    dark: '#2B2B2B',
                    blue: '#3347FF',
                    peach: '#FFE3D6',
                    rawhide: '#B2624F',
                    lightBg: '#F9F8F6',
                    white: '#FFFFFF'
                },
            },
        },
    },
    plugins: [],
};