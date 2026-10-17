import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#101828',
        clinical: '#0f766e',
        urgent: '#dc2626',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
};

export default config;
