import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        polygon: {
          primary: "#8247E5",
          secondary: "#A379FF",
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "scale-in": "scale-in 0.5s ease-out forwards",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "wave": "wave 8s ease-in-out infinite",
        "wave-slow": "wave 12s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "singularity": "singularity 20s ease-in-out infinite",
        "cosmic-pulse": "cosmic-pulse 4s ease-in-out infinite",
        "star-field": "star-field 30s linear infinite",
        "particle-drift": "particle-drift 15s linear infinite",
        "space-warp": "space-warp 10s ease-in-out infinite",
        "energy-swirl": "energy-swirl 12s linear infinite",
        "gravitational-pull": "gravitational-pull 8s ease-in-out infinite"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)", opacity: "1" },
          to: { height: "0", opacity: "0" }
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        "wave": {
          "0%, 100%": { transform: "translateY(0) scale(1.5)" },
          "50%": { transform: "translateY(-20px) scale(1.3)" }
        },
        "gradient": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" }
        },
        "singularity": {
          "0%, 100%": { transform: "scale(1) rotate(0deg)" },
          "50%": { transform: "scale(1.1) rotate(180deg)" }
        },
        "cosmic-pulse": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" }
        },
        "star-field": {
          "0%": { transform: "translateZ(0) rotate(0deg)" },
          "100%": { transform: "translateZ(400px) rotate(360deg)" }
        },
        "particle-drift": {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(-20px) translateX(10px)" }
        },
        "space-warp": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "0.5" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "0.5" }
        },
        "energy-swirl": {
          "0%": { transform: "rotate(0deg) scale(1)", opacity: "0.8" },
          "50%": { transform: "rotate(180deg) scale(1.1)", opacity: "1" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "0.8" }
        },
        "gravitational-pull": {
          "0%": { transform: "translateY(100px) scale(0.8)", opacity: "0.5" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
