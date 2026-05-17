/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: '#root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      boxShadow: {
        panel: '0 2px 8px rgba(15, 23, 42, 0.06)',
        'panel-lg': '0 20px 60px rgba(15, 23, 42, 0.24)',
      },
      backgroundImage: {
        'admin-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  plugins: [],
};
