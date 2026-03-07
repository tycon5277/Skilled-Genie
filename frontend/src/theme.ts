// iOS-Style Theme for Skilled Genie App
// Clean, minimal, professional design inspired by Apple's Human Interface Guidelines

export const THEME = {
  // Background colors - iOS system backgrounds
  background: '#F2F2F7',           // iOS secondary system background
  backgroundSecondary: '#FFFFFF',   // iOS primary background (for cards)
  backgroundTertiary: '#E5E5EA',    // iOS tertiary background
  
  // Card colors - Clean white cards
  cardBg: '#FFFFFF',
  cardBorder: 'transparent',        // iOS cards typically don't have borders
  
  // Primary colors - iOS Blue
  primary: '#007AFF',               // iOS system blue
  primaryLight: '#5AC8FA',          // iOS system teal
  primaryDark: '#0051A8',
  
  // Secondary colors
  secondary: '#5856D6',             // iOS system purple
  secondaryLight: '#AF52DE',        // iOS system pink-purple
  
  // Accent colors
  accent: '#34C759',                // iOS system green
  accentLight: '#30D158',
  
  // Text colors - iOS system labels
  text: '#000000',                  // iOS primary label
  textSecondary: '#3C3C43',         // iOS secondary label (with 60% opacity typically)
  textMuted: '#8E8E93',             // iOS tertiary/quaternary label
  textLight: '#FFFFFF',
  
  // Status colors - iOS system colors
  error: '#FF3B30',                 // iOS system red
  success: '#34C759',               // iOS system green
  warning: '#FF9500',               // iOS system orange
  info: '#007AFF',                  // iOS system blue
  
  // iOS-style gradients
  gradientPrimary: ['#007AFF', '#5856D6'],
  gradientSecondary: ['#5AC8FA', '#007AFF'],
  gradientAccent: ['#34C759', '#30D158'],
  
  // iOS-style shadows (subtle, diffused)
  shadow: {
    small: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    large: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 6,
    },
  },
  
  // iOS-style border radius
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    full: 9999,
  },
  
  // iOS-style spacing (based on 8pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 20,
    xl: 28,
    xxl: 44,
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

// iOS-inspired service colors
export const SERVICE_COLORS: { [key: string]: string } = {
  // Home Services - Green/Teal
  'general_cleaning': '#34C759',
  'deep_cleaning': '#30D158',
  'kitchen_cleaning': '#00C7BE',
  'bathroom_cleaning': '#5AC8FA',
  'window_cleaning': '#64D2FF',
  'carpet_cleaning': '#007AFF',
  'move_in_out_cleaning': '#0A84FF',
  
  // Repair & Maintenance - Blue/Orange
  'plumbing': '#007AFF',
  'electrical': '#FF9500',
  'ac_repair': '#5AC8FA',
  'appliance_repair': '#5856D6',
  'carpentry': '#AF52DE',
  'painting': '#FF2D55',
  'handyman': '#8E8E93',
  
  // Driver - Gray/Blue
  'personal_driver': '#636366',
  'outstation_driver': '#8E8E93',
  'corporate_driver': '#48484A',
  
  // Vehicle - Purple
  'luxury_car': '#5856D6',
  'suv_rental': '#AF52DE',
  'vintage_car': '#BF5AF2',
  
  // Photography - Pink/Red
  'wedding_photography': '#FF2D55',
  'event_photography': '#FF375F',
  'portrait_photography': '#FF453A',
  'product_photography': '#D70015',
  'videography': '#FF3B30',
  
  // Beauty - Pink
  'hair_styling': '#FF2D55',
  'makeup': '#FF375F',
  'nail_art': '#BF5AF2',
  'spa_services': '#AF52DE',
  'bridal_services': '#FF2D55',
  
  // Fitness - Orange/Green
  'personal_trainer': '#FF9500',
  'yoga_instructor': '#FFCC00',
  'nutritionist': '#34C759',
  'physiotherapist': '#5AC8FA',
  
  // Pet Care - Orange
  'dog_walking': '#FF9500',
  'pet_grooming': '#FF9F0A',
  'pet_sitting': '#FFCC00',
  'pet_training': '#FFD60A',
  
  // Events - Purple/Pink
  'party_planning': '#5856D6',
  'wedding_planning': '#FF2D55',
  'catering': '#FF9500',
  'decoration': '#5AC8FA',
  'dj_services': '#AF52DE',
  
  // Education - Blue
  'academic_tutoring': '#007AFF',
  'music_lessons': '#5856D6',
  'language_tutoring': '#5AC8FA',
  'art_classes': '#FF2D55',
  'test_prep': '#AF52DE',
  
  // Professional - Gray/Blue
  'accounting': '#8E8E93',
  'legal_consultation': '#636366',
  'tax_services': '#48484A',
  'business_consulting': '#007AFF',
  
  // Tech - Blue/Purple
  'computer_repair': '#5856D6',
  'phone_repair': '#AF52DE',
  'network_setup': '#007AFF',
  'data_recovery': '#5AC8FA',
  'software_help': '#0A84FF',
  
  // Gardening - Green
  'lawn_care': '#34C759',
  'plant_care': '#30D158',
  'landscaping': '#00C7BE',
  'tree_trimming': '#32ADE6',
  
  // Elderly Care - Warm
  'companion_care': '#FF2D55',
  'medical_assistance': '#FF3B30',
  'daily_assistance': '#FF9500',
  'mobility_support': '#5AC8FA',
  
  // Delivery - Orange/Gray
  'grocery_delivery': '#FF9500',
  'food_delivery': '#FF9F0A',
  'package_delivery': '#8E8E93',
  'document_delivery': '#636366',
  
  // Fallback
  'default': '#007AFF',
  'other': '#8E8E93',
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
