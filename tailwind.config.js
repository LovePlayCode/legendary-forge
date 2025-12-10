/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
        // 像素游戏锻造主题色 - 暖石工坊
        forge: {
          orange: '#d97706', // 琥珀
          yellow: '#f59e0b',
          brown: '#78350f',
          cream: '#f5f5f4', // 暖白
          dark: '#1c1917', // 深褐
          light: '#e7e5e4', // 浅石
          peach: '#ea580c', // 熔岩
          sand: '#d6d3d1'   // 石沙
        },
        // 像素游戏品质色 - 稍高饱和以适应中性背景
        quality: {
          common: '#78716c',
          rare: '#3b82f6',
          legendary: '#f59e0b'
        },
        // 像素游戏色板 - 暖石色系
        pixel: {
          dark: '#292524',
          darker: '#1c1917',
          wood: '#57534e', // 实际上是深石色
          woodLight: '#78716c',
          border: '#44403c',
          shadow: '#1c1917',
          copper: '#b45309',
          gold: '#f59e0b',
          emerald: '#15803d',
          sapphire: '#1d4ed8',
          ruby: '#b91c1c',
          amethyst: '#7e22ce'
        },
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: '16px',
        md: '12px',
        sm: '8px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        full: '9999px'
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace']
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.08)' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.6', transform: 'scale(0.85) rotate(10deg)' }
        },
        'soft-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.02)' }
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-4px)' },
          '75%': { transform: 'translateY(2px)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-in': 'bounce-in 0.4s ease-out',
        sparkle: 'sparkle 1s ease-in-out infinite',
        'soft-float': 'soft-float 2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'soft-bounce': 'soft-bounce 1s ease-in-out infinite'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
