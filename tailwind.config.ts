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
        "spin-slow": "spin 20s linear infinite",
        "wave": "wave 8s ease-in-out infinite",
        "wave-slow": "wave 12s ease-in-out infinite",
        "gradient": "gradient 8s ease infinite",
        "spiral-in": "spiral-in 10s ease-in-out infinite",
        "particle-drift": "particle-drift 15s linear infinite",
        "space-warp": "space-warp 10s ease-in-out infinite",
        "accretion-spin": "accretion-spin 30s linear infinite",
        "light-beam": "light-beam 8s ease-in-out infinite",
        "matter-stream": "matter-stream 15s linear infinite",
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
        "spiral-in": {
          "0%": { transform: "rotate(0deg) translateX(0)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "rotate(360deg) translateX(200px)", opacity: "0" }
        },
        "particle-drift": {
          "0%": { transform: "translateY(0) translateX(0) rotate(0deg)" },
          "50%": { transform: "translateY(-100px) translateX(50px) rotate(180deg)" },
          "100%": { transform: "translateY(0) translateX(0) rotate(360deg)" }
        },
        "space-warp": {
          "0%": { transform: "scale(1) rotate(0deg)", opacity: "0.5" },
          "50%": { transform: "scale(1.5) rotate(180deg)", opacity: "0.8" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "0.5" }
        },
        "accretion-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "light-beam": {
          "0%, 100%": { 
            opacity: "0.4",
            transform: "scale(1) translateY(0)"
          },
          "50%": { 
            opacity: "0.8",
            transform: "scale(1.2) translateY(-20px)"
          }
        },
        "matter-stream": {
          "0%": { 
            transform: "rotate(0deg) translateX(0) scale(1)",
            opacity: "0"
          },
          "50%": { 
            transform: "rotate(180deg) translateX(100px) scale(1.5)",
            opacity: "0.8"
          },
          "100%": { 
            transform: "rotate(360deg) translateX(0) scale(1)",
            opacity: "0"
          }
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
