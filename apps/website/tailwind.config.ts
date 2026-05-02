import type {Config} from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00113a',
        'primary-container': '#002366',
        'primary-fixed': '#dbe1ff',
        'primary-fixed-dim': '#b3c5ff',
        secondary: '#904d00',
        'secondary-container': '#fd8b00',
        'secondary-fixed': '#ffdcc3',
        'secondary-fixed-dim': '#ffb77d',
        tertiary: '#705d00',
        'tertiary-container': '#c9a900',
        'tertiary-fixed': '#ffe16d',
        'tertiary-fixed-dim': '#e9c400',
        background: '#f8f9fa',
        surface: '#f8f9fa',
        'surface-bright': '#f8f9fa',
        'surface-dim': '#d9dadb',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f3f4f5',
        'surface-container': '#edeeef',
        'surface-container-high': '#e7e8e9',
        'surface-container-highest': '#e1e3e4',
        'surface-variant': '#e1e3e4',
        outline: '#757682',
        'outline-variant': '#c5c6d2',
        'on-primary': '#ffffff',
        'on-primary-container': '#758dd5',
        'on-primary-fixed': '#00174a',
        'on-primary-fixed-variant': '#2a4386',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#603100',
        'on-secondary-fixed': '#2f1500',
        'on-secondary-fixed-variant': '#6e3900',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#4c3f00',
        'on-tertiary-fixed': '#221b00',
        'on-tertiary-fixed-variant': '#544600',
        'on-surface': '#191c1d',
        'on-surface-variant': '#444650',
        'on-background': '#191c1d',
        'surface-tint': '#435b9f',
        error: '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        'inverse-surface': '#2e3132',
        'inverse-on-surface': '#f0f1f2',
        'inverse-primary': '#b3c5ff'
      },
      fontFamily: {
        headline: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        label: ['var(--font-label)']
      },
      borderRadius: {
        xl2: '1.5rem',
        xl3: '2rem'
      },
      boxShadow: {
        float: '0 24px 60px rgba(0, 17, 58, 0.12)',
        panel: '0 18px 44px rgba(0, 17, 58, 0.08)'
      }
    }
  },
  plugins: []
};

export default config;
