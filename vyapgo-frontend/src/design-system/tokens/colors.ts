// Indian-inspired color palette
export const colors = {
    // Primary brand colors
    vyap: {
      orange: '#f97316',     // Saffron-inspired
      blue: '#3b82f6',       // Traditional blue
      green: '#10b981',      // Prosperity green
    },
  
    // Indian cultural colors
    cultural: {
      saffron: '#ff9933',    // Indian flag saffron
      white: '#ffffff',      // Indian flag white
      emerald: '#138808',    // Indian flag green
      lotus: '#f8c8dc',      // Lotus pink
      turmeric: '#fdb462',   // Turmeric yellow
      henna: '#964b00',      // Henna brown
    },
  
    // Semantic colors
    semantic: {
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626',
      info: '#2563eb',
    },
  
    // Neutral palette
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  
    // Voice interaction colors
    voice: {
      inactive: '#94a3b8',
      listening: '#f59e0b',
      processing: '#3b82f6',
      active: '#10b981',
      error: '#ef4444',
    },
  
    // Build status colors
    build: {
      pending: '#94a3b8',
      progress: '#3b82f6',
      completed: '#10b981',
      error: '#ef4444',
      skipped: '#f59e0b',
    },
  } as const;
  
  export type ColorToken = keyof typeof colors;
  