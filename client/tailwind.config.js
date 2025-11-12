export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#007BFF',
        'primary-dark': '#0056b3',
        secondary: '#FFD700',
        light: '#F5F7FA',
        dark: '#333',
        success: '#28A745',
        danger: '#DC3545',
        warning: '#FFC107',
        info: '#17A2B8',
        gray: '#6C757D',
        'light-gray': '#E9ECEF',
      },
      fontFamily: {
        apple: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}