/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    emerald: '#064e3b',
                    gold: '#d4af37',
                    parchment: '#fdfcf6',
                    slate: '#0f172a',
                },
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    800: '#065f46',
                    900: '#064e3b',
                },
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    800: '#1e293b',
                    900: '#0f172a',
                },
                gold: '#d4af37',
            },
            fontFamily: {
                sans: ['DM Sans', 'Inter', 'system-ui', 'sans-serif'],
                urdu: ['Gulzar', 'serif'],
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.25rem',
                '3xl': '1.5rem',
            },
            animation: {
                'in': 'in 0.3s ease-out',
                'fade-in': 'fade-in 0.5s ease-out',
                'slide-in-bottom': 'slide-in-bottom 0.5s ease-out',
            },
            keyframes: {
                in: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-in-bottom': {
                    '0%': { transform: 'translateY(1rem)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            }
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}
