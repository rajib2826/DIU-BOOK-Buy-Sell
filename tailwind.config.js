/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      spacing: {
        7: '1.75rem',
        9: '2.25rem',
        28: '7rem',
        80: '20rem',
        96: '24rem',
        128: '32rem',
        136: '36rem',
        140: '40rem',
      },
      height: {
        '1/2': '50%',
        98: '34rem',
        94: '28rem',
      },
      width: {
        90: '22.5rem',
        98: '28rem',
        99: '30rem',
      },
      maxWidth: {
        '8xl': '85rem',
      },
      maxHeight: {
        98: '34rem',
        99: '38rem',
      },
      scale: {
        30: '.3',
      },
      zIndex: {
        100: '100',
      },
      boxShadow: {
        '3xl': '0px 8px 25px rgba(0, 0, 0, 0.07)',
        '4xl': '0px 8px 25px rgba(0, 0, 0, 0.04);',
        '5xl': '0px 8px 25px rgba(0, 0, 0, 0.12)',
        '6xl': '0px 8px 25px rgba(0, 0, 0, 0.20)',
        outline: '0 0 0 3px rgba(101, 31, 255, 0.4)',
      },
    },
  },
  variants: {
    scale: ['responsive', 'hover', 'focus', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    opacity: ['responsive', 'hover', 'focus', 'group-hover'],
    backgroundColor: ['responsive', 'hover', 'focus', 'group-hover'],
    display: ['responsive', 'group-hover', 'group-focus'],
    extend: {
      margin: ['last'],
      backgroundColor: ['odd'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
