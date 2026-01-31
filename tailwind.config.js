/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090b", // Deep black-blue
        foreground: "#f8fafc", // White text
        primary: {
          DEFAULT: "#06b6d4", // Cyan Neon
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#8b5cf6", // Violet Neon
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#ef4444", // Red Neon
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10b981", // Green Neon
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#18181b", // Zinc 900
          foreground: "#a1a1aa", // Zinc 400
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.03)",
          foreground: "#f8fafc",
        },
        popover: {
          DEFAULT: "#09090b",
          foreground: "#f8fafc",
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #06b6d433 0deg, #8b5cf633 180deg, #06b6d433 360deg)',
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3)',
        'neon-purple': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
