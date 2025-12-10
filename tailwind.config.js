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
        // 像素游戏品质色 - 7级品质
        quality: {
          poor: '#9ca3af',      // 粗糙 - 灰色
          common: '#78716c',    // 普通 - 石色
          uncommon: '#22c55e',  // 精良 - 绿色
          rare: '#3b82f6',      // 稀有 - 蓝色
          epic: '#a855f7',      // 史诗 - 紫色
          legendary: '#f59e0b', // 传说 - 橙色
          mythic: '#ef4444'     // 神话 - 红色
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
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 12px rgba(59,130,246,0.5)' },
          '50%': { opacity: '0.9', boxShadow: '0 0 20px rgba(59,130,246,0.7)' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(234,179,8,0.6), inset 0 0 8px rgba(234,179,8,0.2)' },
          '50%': { boxShadow: '0 0 25px rgba(234,179,8,0.8), inset 0 0 12px rgba(234,179,8,0.3)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' }
        },
        'float-particle': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.8' },
          '25%': { transform: 'translateY(-8px) translateX(3px)', opacity: '1' },
          '50%': { transform: 'translateY(-12px) translateX(-2px)', opacity: '0.6' },
          '75%': { transform: 'translateY(-6px) translateX(4px)', opacity: '0.9' }
        },
        'float-particle-delay': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.7' },
          '33%': { transform: 'translateY(-10px) translateX(-4px)', opacity: '1' },
          '66%': { transform: 'translateY(-5px) translateX(3px)', opacity: '0.5' }
        },
        'float-particle-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(-15px) translateX(5px)', opacity: '0.9' }
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' }
        },
        'twinkle-delay': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.7)' },
          '50%': { opacity: '0.9', transform: 'scale(1.1)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce-in': 'bounce-in 0.4s ease-out',
        sparkle: 'sparkle 1s ease-in-out infinite',
        'soft-float': 'soft-float 2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'soft-bounce': 'soft-bounce 1s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'float-particle': 'float-particle 2s ease-in-out infinite',
        'float-particle-delay': 'float-particle-delay 2.5s ease-in-out infinite 0.3s',
        'float-particle-slow': 'float-particle-slow 3s ease-in-out infinite',
        'twinkle': 'twinkle 1.5s ease-in-out infinite',
        'twinkle-delay': 'twinkle-delay 1.8s ease-in-out infinite 0.5s'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
