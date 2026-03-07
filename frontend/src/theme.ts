export const THEME = {
  // Background colors
  background: '#FDF8F3',
  backgroundSecondary: '#F5EDE4',
  
  // Card colors
  cardBg: '#FFFFFF',
  cardBorder: '#E8DFD5',
  
  // Primary colors (Amber/Orange)
  primary: '#D97706',
  primaryLight: '#F59E0B',
  primaryDark: '#B45309',
  
  // Secondary colors (Cyan)
  secondary: '#0891B2',
  secondaryLight: '#22D3EE',
  
  // Accent (Green)
  accent: '#059669',
  accentLight: '#10B981',
  
  // Text colors
  text: '#44403C',
  textSecondary: '#78716C',
  textMuted: '#A8A29E',
  textLight: '#FFFFFF',
  
  // Status colors
  error: '#DC2626',
  success: '#059669',
  warning: '#F59E0B',
  info: '#0891B2',
  
  // Gradients
  gradientPrimary: ['#F59E0B', '#D97706'],
  gradientSecondary: ['#22D3EE', '#0891B2'],
  gradientAccent: ['#10B981', '#059669'],
  
  // Shadows
  shadow: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  
  // Border radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
    full: 9999,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export const SERVICE_ICONS: { [key: string]: string } = {
  plumbing: 'water',
  electrical: 'flash',
  cleaning: 'sparkles',
  carpentry: 'hammer',
  painting: 'color-palette',
  other: 'construct',
};

export const SERVICE_COLORS: { [key: string]: string } = {
  plumbing: '#0891B2',
  electrical: '#F59E0B',
  cleaning: '#10B981',
  carpentry: '#8B5CF6',
  painting: '#EC4899',
  other: '#6B7280',
};
