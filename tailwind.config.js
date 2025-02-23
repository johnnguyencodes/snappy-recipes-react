/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./@/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    fontSize: {
      xs: ["0.8125rem", { lineHeight: "1.5rem" }],
      sm: ["0.875rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.75rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "2rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2rem", { lineHeight: "2.5rem" }],
      "5xl": ["3rem", { lineHeight: "3.5rem" }],
      "6xl": ["3.75rem", { lineHeight: "1" }],
      "7xl": ["4.5rem", { lineHeight: "1" }],
      "8xl": ["6rem", { lineHeight: "1" }],
      "9xl": ["8rem", { lineHeight: "1" }],
    },
    extend: {
      fontFamily: {
        sans: [
          "Inter var",
          ...require("tailwindcss/defaultTheme").fontFamily.sans,
        ],
      },
      borderRadius: {
        lg: "12px",
        md: "10px",
        sm: "8px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // dark mode colors
        "darkmode-text": "#FCFCFA",
        "darkmode-background": "#2D2A2E",
        "darkmode-dark1": "#221F22",
        "darkmode-dark2": "#19181A",
        "darkmode-dimmed1": "#C1C0C0",
        "darkmode-dimmed2": "#939293",
        "darkmode-dimmed3": "#727072",
        "darkmode-dimmed4": "#5B595C",
        "darkmode-dimmed5": "#403E41",
        "darkmode-panel": "#FDF7F3",
        "darkmode-light": "#FFFCFA",
        "darkmode-red": "#FF6188",
        "darkmode-orange": "#FC9867",
        "darkmode-yellow": "#FFD866",
        "darkmode-green": "#AADC76",
        "darkmode-blue": "#78DCE8",
        "darkmode-purple": "#AB9DF2",

        // lightmode colors
        "lightmode-text": "#2C232E",
        "lightmode-background": "#F8EFE7",
        "lightmode-dark1": "#EEE5DE",
        "lightmode-dark2": "#D2C9C4",
        "lightmode-dimmed1": "#72696D",
        "lightmode-dimmed2": "#92898A",
        "lightmode-dimmed3": "#A59C9C",
        "lightmode-dimmed4": "#BEB5B3",
        "lightmode-dimmed5": "#D2C9C4",
        "lightmode-panel": "#FDF7F3",
        "lightmode-light": "#FFFCFA",
        "lightmode-red": "#CE4770",
        "lightmode-orange": "#D4572B",
        "lightmode-yellow": "#B16803",
        "lightmode-green": "#218871",
        "lightmode-blue": "#2473B6",
        "lightmode-purple": "#6851A2",
        "lightmode-highlight": "#FEE1CF",
        "darkmode-highlight": "#CFE8E5",
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
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 4s linear infinite",
      },
      backgroundImage: (theme) => ({
        shimmerLight: `linear-gradient(to left, ${theme("colors.lightmode-dimmed4")} 25%, ${theme("colors.lightmode-dimmed5")} 50%, ${theme("colors.lightmode-dimmed4")} 75%)`,
        shimmerDark: `linear-gradient(to left, ${theme("colors.darkmode-dimmed4")} 25%, ${theme("colors.darkmode-dimmed5")} 50%, ${theme("colors.darkmode-dimmed4")} 75%)`,
      }),
      typography: (theme) => ({
        maincolors: {
          css: {
            "--tw-prose-headings": theme("colors.dark"),
          },
        },
      }),
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("tailwindcss-debug-screens"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/container-queries"),
  ],
};
