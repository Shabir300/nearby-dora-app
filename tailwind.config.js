/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                emerald: {
                    900: '#064e3b',
                    800: '#065f46',
                    700: '#047857',
                },
                slate: {
                    800: '#1e293b',
                    900: '#0f172a',
                },
                gold: '#d4af37',
            },
            animation: {
                'in': 'in 0.3s ease-out',
            },
            keyframes: {
                in: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            }
        },
    },
    plugins: [
        require('tailwindcss-animate'),
    ],
}
