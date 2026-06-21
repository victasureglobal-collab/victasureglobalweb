/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0D2C54",
          light: "#1e4475",
          dark: "#06152b",
        },
        secondary: {
          DEFAULT: "#2E7D32",
          light: "#3d9642",
          dark: "#1e5221",
        },
        accent: {
          DEFAULT: "#C89B3C",
          light: "#d5af5c",
          dark: "#a27a28",
        },
        neutral: {
          dark: "#1A1A1A",
          lightBg: "#F8F9FA",
          border: "#E5E7EB",
        }
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        'large': '12px',
        'xlarge': '16px',
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(13, 44, 84, 0.08)',
        'premium-hover': '0 20px 40px -15px rgba(13, 44, 84, 0.15)',
        'gold-glow': '0 4px 14px 0 rgba(200, 155, 60, 0.3)',
      }
    },
  },
  plugins: [],
}
