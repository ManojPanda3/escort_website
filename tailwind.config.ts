import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        // Custom Themes 🎨
        sepia: {
          DEFAULT: "#704214",
          foreground: "#ffffff",
          button: "#a67c52",
          text: "#000000",
        },
        cyberpunk: {
          DEFAULT: "#ff00ff",
          foreground: "#00ffff",
          button: "#ff4500",
          text: "#000000",
        },
        dracula: {
          DEFAULT: "#282a36",
          foreground: "#f8f8f2",
          button: "#8be9fd",
          text: "#000000",
        },
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        pulseGlow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 105, 180, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(255, 105, 180, 1)" },
          "100%": { boxShadow: "0 0 5px rgba(255, 105, 180, 0.5)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.3s ease-in",
        pulseGlow: "pulseGlow 2s infinite",
      },
    },
  },

  plugins: [
    require("tailwindcss-animate"),
    plugin(({ addVariant }) => {
      addVariant("sepia", "&.sepia");
      addVariant("cyberpunk", "&.cyberpunk");
      addVariant("dracula", "&.dracula");
    }),
  ],
} satisfies Config;

export default config;