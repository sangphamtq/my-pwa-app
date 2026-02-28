import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
      colors: {
        epl: {
          purple: '#37003C',
          pink: '#FF2882',
          green: '#00FF87',
          white: '#F8F8F8',
          gray: '#1A1A2E',
          card: '#0F0F1E',
        },
      },
    },
  },
  plugins: [],
}
export default config
