// Shared Tailwind Play CDN configuration. Loaded after
// https://cdn.tailwindcss.com on every page so all pages share the same
// theme tokens (colors, fonts, shadows, gradients).
tailwind.config = {
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef0fa',
          100: '#d4d8f1',
          200: '#aeb4e1',
          300: '#7e87cd',
          400: '#545eb6',
          500: '#343da3',
          600: '#2e3192',
          700: '#242678',
          800: '#1b1c5c',
          900: '#131445',
          950: '#0b0c2e',
        },
        brand: {
          orange: '#F6821F',
          'orange-dark': '#D96810',
          'orange-light': '#F8A359',
          red: '#ED1C24',
          'red-dark': '#C91017',
        },
        ink: '#0B1124',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(19, 20, 69, 0.15)',
        glow: '0 20px 60px -20px rgba(246, 130, 31, 0.45)',
        card: '0 4px 24px -6px rgba(19, 20, 69, 0.12)',
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #F6821F 0%, #ED1C24 100%)',
        'grad-navy': 'linear-gradient(135deg, #242678 0%, #131445 100%)',
      },
    },
  },
};
