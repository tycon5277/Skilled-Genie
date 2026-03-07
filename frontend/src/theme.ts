export const THEME = {
  // Background colors - Clean, fresh white/light gray
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  
  // Card colors
  cardBg: '#FFFFFF',
  cardBorder: '#E2E8F0',
  
  // Primary colors (Calm Teal/Blue)
  primary: '#0EA5E9',
  primaryLight: '#38BDF8',
  primaryDark: '#0284C7',
  
  // Secondary colors (Slate Blue)
  secondary: '#6366F1',
  secondaryLight: '#818CF8',
  
  // Accent (Fresh Green)
  accent: '#10B981',
  accentLight: '#34D399',
  
  // Text colors - Professional slate tones
  text: '#1E293B',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textLight: '#FFFFFF',
  
  // Status colors
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#0EA5E9',
  
  // Gradients - Modern, calm
  gradientPrimary: ['#38BDF8', '#0EA5E9'],
  gradientSecondary: ['#818CF8', '#6366F1'],
  gradientAccent: ['#34D399', '#10B981'],
  
  // Shadows
  shadow: {
    small: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    large: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
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

// Service type icons mapping
export const SERVICE_ICONS: { [key: string]: string } = {
  // Home Services
  'general_cleaning': 'sparkles',
  'deep_cleaning': 'sparkles',
  'kitchen_cleaning': 'restaurant',
  'bathroom_cleaning': 'water',
  'window_cleaning': 'grid',
  'carpet_cleaning': 'layers',
  'move_in_out_cleaning': 'home',
  
  // Repair & Maintenance
  'plumbing': 'water',
  'electrical': 'flash',
  'ac_repair': 'snow',
  'appliance_repair': 'settings',
  'carpentry': 'hammer',
  'painting': 'color-palette',
  'handyman': 'construct',
  
  // Driver
  'personal_driver': 'car',
  'outstation_driver': 'navigate',
  'corporate_driver': 'briefcase',
  
  // Vehicle
  'luxury_car': 'car-sport',
  'suv_rental': 'car',
  'vintage_car': 'car',
  
  // Commercial
  'truck_driver': 'bus',
  'heavy_vehicle': 'bus',
  
  // Photography
  'wedding_photography': 'camera',
  'event_photography': 'camera',
  'portrait_photography': 'person',
  'product_photography': 'cube',
  'videography': 'videocam',
  
  // Beauty
  'hair_styling': 'cut',
  'makeup': 'brush',
  'nail_art': 'hand-left',
  'spa_services': 'leaf',
  'bridal_services': 'heart',
  
  // Fitness
  'personal_trainer': 'fitness',
  'yoga_instructor': 'body',
  'nutritionist': 'nutrition',
  'physiotherapist': 'medkit',
  
  // Pet Care
  'dog_walking': 'paw',
  'pet_grooming': 'cut',
  'pet_sitting': 'home',
  'pet_training': 'school',
  
  // Events
  'party_planning': 'balloon',
  'wedding_planning': 'heart',
  'catering': 'restaurant',
  'decoration': 'color-palette',
  'dj_services': 'musical-notes',
  
  // Education
  'academic_tutoring': 'book',
  'music_lessons': 'musical-note',
  'language_tutoring': 'language',
  'art_classes': 'brush',
  'test_prep': 'document-text',
  
  // Professional
  'accounting': 'calculator',
  'legal_consultation': 'briefcase',
  'tax_services': 'document',
  'business_consulting': 'trending-up',
  
  // Tech
  'computer_repair': 'desktop',
  'phone_repair': 'phone-portrait',
  'network_setup': 'wifi',
  'data_recovery': 'cloud-download',
  'software_help': 'code-slash',
  
  // Gardening
  'lawn_care': 'leaf',
  'plant_care': 'flower',
  'landscaping': 'map',
  'tree_trimming': 'cut',
  
  // Elderly Care
  'companion_care': 'heart',
  'medical_assistance': 'medkit',
  'daily_assistance': 'hand-right',
  'mobility_support': 'walk',
  
  // Delivery
  'grocery_delivery': 'cart',
  'food_delivery': 'fast-food',
  'package_delivery': 'cube',
  'document_delivery': 'document',
  
  // Fallback
  'default': 'construct',
  'other': 'construct',
};

// Service colors - Fresh, modern palette
export const SERVICE_COLORS: { [key: string]: string } = {
  // Home Services - Green tones
  'general_cleaning': '#10B981',
  'deep_cleaning': '#059669',
  'kitchen_cleaning': '#14B8A6',
  'bathroom_cleaning': '#06B6D4',
  'window_cleaning': '#22D3EE',
  'carpet_cleaning': '#0EA5E9',
  'move_in_out_cleaning': '#0284C7',
  
  // Repair & Maintenance - Blue tones
  'plumbing': '#0EA5E9',
  'electrical': '#F59E0B',
  'ac_repair': '#06B6D4',
  'appliance_repair': '#6366F1',
  'carpentry': '#8B5CF6',
  'painting': '#EC4899',
  'handyman': '#64748B',
  
  // Driver - Slate tones
  'personal_driver': '#475569',
  'outstation_driver': '#64748B',
  'corporate_driver': '#334155',
  
  // Vehicle - Purple tones
  'luxury_car': '#8B5CF6',
  'suv_rental': '#7C3AED',
  'vintage_car': '#A855F7',
  
  // Photography - Rose tones
  'wedding_photography': '#EC4899',
  'event_photography': '#F472B6',
  'portrait_photography': '#DB2777',
  'product_photography': '#BE185D',
  'videography': '#9D174D',
  
  // Beauty - Pink/Rose
  'hair_styling': '#EC4899',
  'makeup': '#F472B6',
  'nail_art': '#E879F9',
  'spa_services': '#C084FC',
  'bridal_services': '#DB2777',
  
  // Fitness - Orange/Amber
  'personal_trainer': '#F59E0B',
  'yoga_instructor': '#FBBF24',
  'nutritionist': '#10B981',
  'physiotherapist': '#06B6D4',
  
  // Pet Care - Warm tones
  'dog_walking': '#F97316',
  'pet_grooming': '#FB923C',
  'pet_sitting': '#FBBF24',
  'pet_training': '#F59E0B',
  
  // Events - Vibrant
  'party_planning': '#8B5CF6',
  'wedding_planning': '#EC4899',
  'catering': '#F59E0B',
  'decoration': '#06B6D4',
  'dj_services': '#6366F1',
  
  // Education - Blue tones
  'academic_tutoring': '#3B82F6',
  'music_lessons': '#8B5CF6',
  'language_tutoring': '#06B6D4',
  'art_classes': '#EC4899',
  'test_prep': '#6366F1',
  
  // Professional - Slate/Blue
  'accounting': '#64748B',
  'legal_consultation': '#475569',
  'tax_services': '#334155',
  'business_consulting': '#0EA5E9',
  
  // Tech - Blue/Purple
  'computer_repair': '#6366F1',
  'phone_repair': '#8B5CF6',
  'network_setup': '#0EA5E9',
  'data_recovery': '#06B6D4',
  'software_help': '#3B82F6',
  
  // Gardening - Green
  'lawn_care': '#22C55E',
  'plant_care': '#10B981',
  'landscaping': '#059669',
  'tree_trimming': '#047857',
  
  // Elderly Care - Warm, caring
  'companion_care': '#EC4899',
  'medical_assistance': '#EF4444',
  'daily_assistance': '#F59E0B',
  'mobility_support': '#06B6D4',
  
  // Delivery - Orange
  'grocery_delivery': '#F97316',
  'food_delivery': '#FB923C',
  'package_delivery': '#64748B',
  'document_delivery': '#475569',
  
  // Fallback
  'default': '#0EA5E9',
  'other': '#64748B',
};

// Helper to get icon for a skill
export const getSkillIcon = (skill: string): string => {
  const normalizedSkill = skill.toLowerCase().replace(/\s+/g, '_');
  return SERVICE_ICONS[normalizedSkill] || SERVICE_ICONS['default'];
};

// Helper to get color for a skill
export const getSkillColor = (skill: string): string => {
  const normalizedSkill = skill.toLowerCase().replace(/\s+/g, '_');
  return SERVICE_COLORS[normalizedSkill] || SERVICE_COLORS['default'];
};
