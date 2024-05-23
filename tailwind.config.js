/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                'primary': '#7808ED',
                'primary-50': '#f2eaff',
                'primary-100': '#e6ccff',
                'primary-200': '#bf80ff',
                'primary-300': '#9955ff',
                'primary-400': '#7d30ff',
                'primary-500': '#7808ED',
                'primary-600': '#5c06b3',
                'primary-700': '#440480',
                'primary-800': '#2e0366',
                'primary-900': '#1f0244',
                'secondary': '#ED080B',
                'secondary-50': '#ffedee',
                'secondary-100': '#ffd6d7',
                'secondary-200': '#ffb0b2',
                'secondary-300': '#ff898b',
                'secondary-400': '#ff6a6d',
                'secondary-500': '#ed080b',
                'secondary-600': '#c40609',
                'secondary-700': '#9a0406',
                'secondary-800': '#700303',
                'secondary-900': '#510202',
            },
        },
    },
    plugins: [],
};
