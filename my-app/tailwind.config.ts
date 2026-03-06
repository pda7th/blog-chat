import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const pxToRem = (px: number, base = 16) => `${px / base}rem`;

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: Array.from({ length: 1000 }, (_, index) => {
        const value = pxToRem(index + 1);
        return { [`${index + 1}pxr`]: value };
      }).reduce((acc, obj) => ({ ...acc, ...obj }), {}),
    },
  },
  plugins: [typography],
};
export default config;
