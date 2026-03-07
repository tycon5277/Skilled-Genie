// Skill Categories Data for Skilled Genie
export const SKILL_CATEGORIES = [
  // 🏠 HOME SERVICES
  {
    id: 'home_services',
    title: 'Home Services',
    subtitle: 'Cleaning & maintenance',
    emoji: '🏠',
    color: '#F59E0B',
    skills: [
      { id: 'deep_cleaning', name: 'Deep Cleaning', emoji: '🧹', description: 'Professional home deep clean' },
      { id: 'regular_cleaning', name: 'Regular Cleaning', emoji: '✨', description: 'Daily/weekly home cleaning' },
      { id: 'kitchen_cleaning', name: 'Kitchen Cleaning', emoji: '🍳', description: 'Kitchen & appliance cleaning' },
      { id: 'bathroom_cleaning', name: 'Bathroom Cleaning', emoji: '🚿', description: 'Bathroom sanitization' },
      { id: 'carpet_cleaning', name: 'Carpet Cleaning', emoji: '🧽', description: 'Deep carpet & rug cleaning' },
      { id: 'sofa_cleaning', name: 'Sofa & Upholstery', emoji: '🛋️', description: 'Furniture deep cleaning' },
      { id: 'laundry', name: 'Laundry & Ironing', emoji: '👔', description: 'Wash, dry & iron clothes' },
      { id: 'dishwashing', name: 'Dishwashing', emoji: '🍽️', description: 'Utensil cleaning service' },
      { id: 'window_cleaning', name: 'Window Cleaning', emoji: '🪟', description: 'Glass & window cleaning' },
      { id: 'organizing', name: 'Home Organizing', emoji: '📦', description: 'Declutter & organize spaces' },
      { id: 'mattress_cleaning', name: 'Mattress Cleaning', emoji: '🛏️', description: 'Mattress sanitization' },
      { id: 'chimney_cleaning', name: 'Chimney Cleaning', emoji: '🔥', description: 'Chimney & exhaust cleaning' },
    ],
  },
  
  // 🔧 REPAIR & MAINTENANCE
  {
    id: 'repair_maintenance',
    title: 'Repair & Maintenance',
    subtitle: 'Fix anything, anywhere',
    emoji: '🔧',
    color: '#3B82F6',
    skills: [
      { id: 'plumbing', name: 'Plumbing', emoji: '🚰', description: 'Pipes, taps & water systems' },
      { id: 'electrical', name: 'Electrical Work', emoji: '⚡', description: 'Wiring, switches & fixtures' },
      { id: 'carpentry', name: 'Carpentry', emoji: '🪚', description: 'Wood work & furniture repair' },
      { id: 'painting', name: 'Painting', emoji: '🎨', description: 'Interior & exterior painting' },
      { id: 'ac_repair', name: 'AC Repair & Service', emoji: '❄️', description: 'AC installation & repair' },
      { id: 'refrigerator', name: 'Refrigerator Repair', emoji: '🧊', description: 'Fridge & freezer repair' },
      { id: 'washing_machine', name: 'Washing Machine', emoji: '🌀', description: 'Washer repair & service' },
      { id: 'tv_repair', name: 'TV Repair', emoji: '📺', description: 'Television repair & mounting' },
      { id: 'microwave', name: 'Microwave & Oven', emoji: '🍕', description: 'Kitchen appliance repair' },
      { id: 'geyser', name: 'Geyser & Water Heater', emoji: '🔥', description: 'Water heater service' },
      { id: 'fan_repair', name: 'Fan & Cooler Repair', emoji: '💨', description: 'Ceiling fan & cooler service' },
      { id: 'inverter', name: 'Inverter & UPS', emoji: '🔋', description: 'Power backup solutions' },
      { id: 'furniture_assembly', name: 'Furniture Assembly', emoji: '🪑', description: 'Assemble IKEA & flat-pack' },
      { id: 'door_lock', name: 'Door & Lock Repair', emoji: '🔐', description: 'Locks, doors & handles' },
      { id: 'waterproofing', name: 'Waterproofing', emoji: '💧', description: 'Leak repair & waterproofing' },
    ],
  },

  // 🧑‍✈️ DRIVER ON DEMAND
  {
    id: 'driver_services',
    title: 'Driver on Demand',
    subtitle: 'Professional driving services',
    emoji: '🧑‍✈️',
    color: '#6366F1',
    skills: [
      { id: 'personal_driver', name: 'Personal Driver', emoji: '👨‍✈️', description: 'Daily commute & errands' },
      { id: 'outstation_driver', name: 'Outstation Driver', emoji: '🛣️', description: 'Long distance travel' },
      { id: 'corporate_driver', name: 'Corporate Chauffeur', emoji: '💼', description: 'Executive transport' },
      { id: 'airport_transfer', name: 'Airport Transfers', emoji: '✈️', description: 'Airport pickup & drop' },
      { id: 'night_driver', name: 'Night Driver', emoji: '🌙', description: 'Late night driving' },
      { id: 'wedding_driver', name: 'Wedding Chauffeur', emoji: '💒', description: 'Wedding ceremonies' },
      { id: 'vip_driver', name: 'VIP Driver', emoji: '⭐', description: 'Premium escort service' },
      { id: 'female_driver', name: 'Female Driver', emoji: '👩‍✈️', description: 'Women safety driving' },
      { id: 'elderly_driver', name: 'Elderly Assistance', emoji: '👴', description: 'Senior citizen transport' },
      { id: 'medical_transport', name: 'Medical Transport', emoji: '🏥', description: 'Hospital visits' },
    ],
  },

  // 🚗 LUXURY CAR & VEHICLE HIRE
  {
    id: 'luxury_hire',
    title: 'Luxury Car & Vehicle Hire',
    subtitle: 'Premium rides for special occasions',
    emoji: '🚗',
    color: '#FBBF24',
    skills: [
      { id: 'wedding_car', name: 'Wedding Car Hire', emoji: '💒', description: 'Decorated marriage cars' },
      { id: 'luxury_sedan', name: 'Luxury Sedan', emoji: '🚘', description: 'Mercedes, BMW, Audi' },
      { id: 'vintage_car', name: 'Vintage Cars', emoji: '🚙', description: 'Classic & vintage vehicles' },
      { id: 'limousine', name: 'Limousine', emoji: '🎩', description: 'Stretch limo service' },
      { id: 'sports_car', name: 'Sports Car Hire', emoji: '🏎️', description: 'Ferrari, Lamborghini' },
      { id: 'suv_hire', name: 'Premium SUV', emoji: '🚙', description: 'Fortuner, Endeavour, Range Rover' },
      { id: 'party_bus', name: 'Party Bus', emoji: '🎉', description: 'Party & celebrations' },
      { id: 'convertible', name: 'Convertible', emoji: '🌞', description: 'Open-top cars' },
      { id: 'rolls_royce', name: 'Rolls Royce', emoji: '👑', description: 'Ultimate luxury' },
      { id: 'photoshoot_car', name: 'Photoshoot Cars', emoji: '📸', description: 'For photography sessions' },
    ],
  },

  // 🚛 COMMERCIAL VEHICLES
  {
    id: 'commercial_vehicles',
    title: 'Commercial Vehicles',
    subtitle: 'Heavy duty transport solutions',
    emoji: '🚛',
    color: '#EF4444',
    skills: [
      { id: 'truck_driver', name: 'Truck Driver', emoji: '🚚', description: 'Heavy goods transport' },
      { id: 'tempo_driver', name: 'Tempo/Mini Truck', emoji: '🛻', description: 'Small goods transport' },
      { id: 'container_driver', name: 'Container Driver', emoji: '📦', description: 'Container transport' },
      { id: 'tanker_driver', name: 'Tanker Driver', emoji: '⛽', description: 'Liquid transport' },
      { id: 'bus_driver', name: 'Bus Driver', emoji: '🚌', description: 'Passenger bus service' },
      { id: 'school_bus', name: 'School Bus Driver', emoji: '🚸', description: 'School transport' },
      { id: 'tractor_driver', name: 'Tractor Driver', emoji: '🚜', description: 'Agricultural transport' },
      { id: 'crane_operator', name: 'Crane Operator', emoji: '🏗️', description: 'Heavy machinery' },
      { id: 'forklift', name: 'Forklift Operator', emoji: '📋', description: 'Warehouse operations' },
      { id: 'jcb_operator', name: 'JCB Operator', emoji: '🏗️', description: 'Construction machinery' },
    ],
  },

  // 📸 PHOTOGRAPHY & VIDEOGRAPHY
  {
    id: 'photography_video',
    title: 'Photography & Videography',
    subtitle: 'Capture memories beautifully',
    emoji: '📸',
    color: '#EC4899',
    skills: [
      { id: 'wedding_photography', name: 'Wedding Photography', emoji: '💒', description: 'Marriage ceremonies' },
      { id: 'portrait_photo', name: 'Portrait Photography', emoji: '🖼️', description: 'Professional portraits' },
      { id: 'event_photography', name: 'Event Photography', emoji: '🎉', description: 'Parties & events' },
      { id: 'product_photography', name: 'Product Photography', emoji: '📦', description: 'E-commerce photos' },
      { id: 'fashion_photography', name: 'Fashion Photography', emoji: '👗', description: 'Fashion shoots' },
      { id: 'food_photography', name: 'Food Photography', emoji: '🍔', description: 'Restaurant & food' },
      { id: 'real_estate_photo', name: 'Real Estate Photos', emoji: '🏠', description: 'Property photography' },
      { id: 'wedding_video', name: 'Wedding Videography', emoji: '🎬', description: 'Marriage videos' },
      { id: 'corporate_video', name: 'Corporate Videos', emoji: '💼', description: 'Business videos' },
      { id: 'music_video', name: 'Music Videos', emoji: '🎵', description: 'Music production' },
      { id: 'documentary', name: 'Documentary', emoji: '🎥', description: 'Documentary filming' },
      { id: 'live_streaming', name: 'Live Streaming', emoji: '📺', description: 'Live event streaming' },
      { id: 'video_editing', name: 'Video Editing', emoji: '✂️', description: 'Post-production editing' },
      { id: 'photo_editing', name: 'Photo Editing', emoji: '🖌️', description: 'Photo retouching' },
    ],
  },

  // 🚁 DRONE SERVICES
  {
    id: 'drone_services',
    title: 'Drone Services',
    subtitle: 'Aerial photography & more',
    emoji: '🚁',
    color: '#06B6D4',
    skills: [
      { id: 'drone_photography', name: 'Aerial Photography', emoji: '📸', description: 'Drone photos from above' },
      { id: 'drone_videography', name: 'Aerial Videography', emoji: '🎬', description: 'Cinematic drone videos' },
      { id: 'drone_wedding', name: 'Wedding Drone', emoji: '💒', description: 'Wedding aerial shots' },
      { id: 'drone_survey', name: 'Land Survey', emoji: '🗺️', description: 'Property mapping' },
      { id: 'drone_inspection', name: 'Building Inspection', emoji: '🏗️', description: 'Structure inspection' },
      { id: 'drone_events', name: 'Event Coverage', emoji: '🎉', description: 'Event aerial coverage' },
      { id: 'drone_real_estate', name: 'Real Estate Drone', emoji: '🏠', description: 'Property showcase' },
      { id: 'fpv_drone', name: 'FPV Racing Drone', emoji: '🏎️', description: 'Action sports coverage' },
      { id: 'drone_agriculture', name: 'Agricultural Drone', emoji: '🌾', description: 'Crop monitoring' },
      { id: 'drone_delivery', name: 'Drone Delivery', emoji: '📦', description: 'Small item delivery' },
    ],
  },

  // 🛠️ VEHICLE SERVICES
  {
    id: 'vehicle_services',
    title: 'Vehicle Services',
    subtitle: 'Keep vehicles running smooth',
    emoji: '🛠️',
    color: '#EF4444',
    skills: [
      { id: 'car_wash', name: 'Car Washing', emoji: '🚿', description: 'Interior & exterior car wash' },
      { id: 'car_detailing', name: 'Car Detailing', emoji: '✨', description: 'Premium car detailing' },
      { id: 'bike_wash', name: 'Bike Washing', emoji: '🏍️', description: 'Two-wheeler cleaning' },
      { id: 'car_service', name: 'Car Service', emoji: '🔧', description: 'General car maintenance' },
      { id: 'bike_repair', name: 'Bike Repair', emoji: '🛠️', description: 'Two-wheeler repair' },
      { id: 'puncture', name: 'Puncture Repair', emoji: '🔩', description: 'Tyre puncture service' },
      { id: 'battery_service', name: 'Battery Service', emoji: '🔋', description: 'Jump start & battery change' },
      { id: 'denting_painting', name: 'Denting & Painting', emoji: '🎨', description: 'Body work & painting' },
      { id: 'car_polish', name: 'Car Polishing', emoji: '💎', description: 'Paint protection & polish' },
      { id: 'ac_service_car', name: 'Car AC Service', emoji: '❄️', description: 'Vehicle AC repair' },
    ],
  },

  // 💻 TECH SERVICES
  {
    id: 'tech_services',
    title: 'Tech Services',
    subtitle: 'Digital solutions',
    emoji: '💻',
    color: '#06B6D4',
    skills: [
      { id: 'computer_repair', name: 'Computer Repair', emoji: '🖥️', description: 'PC & laptop repair' },
      { id: 'phone_repair', name: 'Phone Repair', emoji: '📱', description: 'Mobile device repair' },
      { id: 'tablet_repair', name: 'Tablet Repair', emoji: '📲', description: 'iPad & tablet service' },
      { id: 'data_recovery', name: 'Data Recovery', emoji: '💾', description: 'Lost data retrieval' },
      { id: 'virus_removal', name: 'Virus Removal', emoji: '🛡️', description: 'Malware & virus cleaning' },
      { id: 'software_install', name: 'Software Install', emoji: '💿', description: 'OS & software setup' },
      { id: 'networking', name: 'WiFi & Networking', emoji: '🌐', description: 'Network setup & repair' },
      { id: 'smart_home', name: 'Smart Home Setup', emoji: '🏡', description: 'IoT & automation' },
      { id: 'cctv', name: 'CCTV Installation', emoji: '📹', description: 'Security camera setup' },
      { id: 'printer', name: 'Printer Service', emoji: '🖨️', description: 'Printer repair & setup' },
      { id: 'gaming_setup', name: 'Gaming Setup', emoji: '🎮', description: 'Gaming PC & console setup' },
      { id: 'website', name: 'Website Development', emoji: '🌍', description: 'Build websites & apps' },
    ],
  },

  // 🌿 GARDEN & OUTDOOR
  {
    id: 'garden_outdoor',
    title: 'Garden & Outdoor',
    subtitle: 'Green spaces & pest control',
    emoji: '🌿',
    color: '#22C55E',
    skills: [
      { id: 'gardening', name: 'Gardening', emoji: '🌱', description: 'Plant care & garden maintenance' },
      { id: 'lawn_mowing', name: 'Lawn Mowing', emoji: '🌾', description: 'Grass cutting & lawn care' },
      { id: 'tree_trimming', name: 'Tree Trimming', emoji: '🌳', description: 'Tree & hedge trimming' },
      { id: 'landscaping', name: 'Landscaping', emoji: '🏞️', description: 'Garden design & setup' },
      { id: 'pest_control', name: 'Pest Control', emoji: '🐜', description: 'Insect & rodent control' },
      { id: 'termite', name: 'Termite Treatment', emoji: '🪲', description: 'Anti-termite service' },
      { id: 'tank_cleaning', name: 'Water Tank Cleaning', emoji: '💧', description: 'Tank sanitization' },
      { id: 'solar_cleaning', name: 'Solar Panel Cleaning', emoji: '☀️', description: 'Solar maintenance' },
      { id: 'terrace_garden', name: 'Terrace Garden', emoji: '🌻', description: 'Rooftop garden setup' },
      { id: 'irrigation', name: 'Irrigation Setup', emoji: '🚿', description: 'Drip & sprinkler systems' },
    ],
  },

  // 💆 WELLNESS & BEAUTY
  {
    id: 'wellness_beauty',
    title: 'Wellness & Beauty',
    subtitle: 'Pamper & rejuvenate',
    emoji: '💆',
    color: '#EC4899',
    skills: [
      { id: 'massage', name: 'Massage Therapy', emoji: '💆', description: 'Relaxation & therapeutic' },
      { id: 'spa_home', name: 'Home Spa', emoji: '🧖', description: 'Spa treatments at home' },
      { id: 'haircut_men', name: "Men's Haircut", emoji: '💈', description: 'Haircut & grooming' },
      { id: 'haircut_women', name: "Women's Haircut", emoji: '💇‍♀️', description: 'Haircut & styling' },
      { id: 'facial', name: 'Facial & Cleanup', emoji: '✨', description: 'Skin care treatments' },
      { id: 'makeup', name: 'Makeup Artist', emoji: '💄', description: 'Professional makeup' },
      { id: 'mehendi', name: 'Mehendi Artist', emoji: '🖐️', description: 'Henna designs' },
      { id: 'manicure', name: 'Manicure & Pedicure', emoji: '💅', description: 'Nail care services' },
      { id: 'waxing', name: 'Waxing & Threading', emoji: '🧴', description: 'Hair removal services' },
      { id: 'yoga', name: 'Yoga Instructor', emoji: '🧘', description: 'Yoga classes at home' },
      { id: 'personal_trainer', name: 'Personal Trainer', emoji: '💪', description: 'Fitness coaching' },
      { id: 'physiotherapy', name: 'Physiotherapy', emoji: '🏃', description: 'Physical therapy' },
      { id: 'dietician', name: 'Dietician', emoji: '🥗', description: 'Nutrition consulting' },
    ],
  },

  // 🐾 PET SERVICES
  {
    id: 'pet_services',
    title: 'Pet Services',
    subtitle: 'For your furry friends',
    emoji: '🐾',
    color: '#F97316',
    skills: [
      { id: 'pet_grooming', name: 'Pet Grooming', emoji: '🛁', description: 'Bath & grooming' },
      { id: 'dog_walking', name: 'Dog Walking', emoji: '🐕', description: 'Daily walks & exercise' },
      { id: 'pet_sitting', name: 'Pet Sitting', emoji: '🏠', description: 'Pet care at your home' },
      { id: 'pet_boarding', name: 'Pet Boarding', emoji: '🐶', description: 'Overnight pet care' },
      { id: 'pet_training', name: 'Pet Training', emoji: '🎓', description: 'Behavior training' },
      { id: 'vet_visit', name: 'Vet Visit Assist', emoji: '🏥', description: 'Vet transportation' },
      { id: 'aquarium', name: 'Aquarium Cleaning', emoji: '🐠', description: 'Fish tank maintenance' },
      { id: 'bird_care', name: 'Bird Care', emoji: '🦜', description: 'Bird feeding & care' },
    ],
  },

  // 📚 EDUCATION & TUTORING
  {
    id: 'education',
    title: 'Education & Tutoring',
    subtitle: 'Share knowledge',
    emoji: '📚',
    color: '#8B5CF6',
    skills: [
      { id: 'math_tutor', name: 'Mathematics', emoji: '🔢', description: 'Math tutoring all levels' },
      { id: 'science_tutor', name: 'Science', emoji: '🔬', description: 'Physics, Chemistry, Biology' },
      { id: 'english_tutor', name: 'English', emoji: '📖', description: 'Language & literature' },
      { id: 'hindi_tutor', name: 'Hindi', emoji: '🇮🇳', description: 'Hindi language tutoring' },
      { id: 'coding_tutor', name: 'Coding', emoji: '👨‍💻', description: 'Programming classes' },
      { id: 'music_lessons', name: 'Music Lessons', emoji: '🎹', description: 'Instrument & vocal' },
      { id: 'art_lessons', name: 'Art & Drawing', emoji: '🎨', description: 'Art classes' },
      { id: 'dance_lessons', name: 'Dance Classes', emoji: '💃', description: 'Dance instruction' },
      { id: 'foreign_lang', name: 'Foreign Languages', emoji: '🗣️', description: 'Learn new languages' },
      { id: 'exam_prep', name: 'Exam Preparation', emoji: '📝', description: 'Competitive exam prep' },
      { id: 'nursery_teach', name: 'Nursery Teaching', emoji: '👶', description: 'Early childhood education' },
      { id: 'special_needs', name: 'Special Needs', emoji: '🤗', description: 'Special education' },
    ],
  },

  // 🎉 EVENTS & ENTERTAINMENT
  {
    id: 'events_entertainment',
    title: 'Events & Entertainment',
    subtitle: 'Make celebrations magical',
    emoji: '🎉',
    color: '#D946EF',
    skills: [
      { id: 'dj', name: 'DJ Services', emoji: '🎧', description: 'Music & entertainment' },
      { id: 'event_decor', name: 'Event Decoration', emoji: '🎈', description: 'Party & event decor' },
      { id: 'balloon_decor', name: 'Balloon Decoration', emoji: '🎈', description: 'Balloon arrangements' },
      { id: 'flower_decor', name: 'Flower Decoration', emoji: '💐', description: 'Floral arrangements' },
      { id: 'catering', name: 'Catering', emoji: '🍽️', description: 'Food & beverage service' },
      { id: 'anchor', name: 'Event Anchor', emoji: '🎤', description: 'MC & hosting' },
      { id: 'magic_show', name: 'Magician', emoji: '🪄', description: 'Magic performances' },
      { id: 'clown', name: 'Clown & Entertainer', emoji: '🤡', description: 'Kids entertainment' },
      { id: 'live_music', name: 'Live Music', emoji: '🎸', description: 'Live band & singers' },
      { id: 'standup', name: 'Stand-up Comedy', emoji: '😂', description: 'Comedy performances' },
      { id: 'game_host', name: 'Game Host', emoji: '🎲', description: 'Party games & activities' },
      { id: 'puppet_show', name: 'Puppet Show', emoji: '🎭', description: 'Kids puppet shows' },
    ],
  },

  // 🍳 CULINARY SERVICES
  {
    id: 'culinary',
    title: 'Culinary Services',
    subtitle: 'Kitchen experts',
    emoji: '🍳',
    color: '#EF4444',
    skills: [
      { id: 'home_cook', name: 'Home Cook', emoji: '👨‍🍳', description: 'Daily meals preparation' },
      { id: 'party_cook', name: 'Party Cooking', emoji: '🎉', description: 'Cooking for events' },
      { id: 'baking', name: 'Baking & Cakes', emoji: '🎂', description: 'Custom cakes & baking' },
      { id: 'tiffin', name: 'Tiffin Service', emoji: '🍱', description: 'Packed meal delivery' },
      { id: 'bbq', name: 'BBQ & Grill', emoji: '🍖', description: 'Barbecue specialist' },
      { id: 'bartending', name: 'Bartending', emoji: '🍸', description: 'Mixology & drinks' },
      { id: 'diet_meal', name: 'Diet Meal Prep', emoji: '🥗', description: 'Healthy meal preparation' },
      { id: 'ethnic_cuisine', name: 'Regional Cuisine', emoji: '🍛', description: 'Traditional cooking' },
    ],
  },

  // 🚚 SHIFTING & LOGISTICS
  {
    id: 'shifting',
    title: 'Shifting & Logistics',
    subtitle: 'Move with ease',
    emoji: '🚚',
    color: '#6366F1',
    skills: [
      { id: 'packers_movers', name: 'Packers & Movers', emoji: '📦', description: 'Full home shifting' },
      { id: 'furniture_moving', name: 'Furniture Moving', emoji: '🛋️', description: 'Heavy item moving' },
      { id: 'office_shifting', name: 'Office Shifting', emoji: '🏢', description: 'Commercial moves' },
      { id: 'loading_unloading', name: 'Loading/Unloading', emoji: '💪', description: 'Manual labor service' },
      { id: 'courier_service', name: 'Courier Service', emoji: '📬', description: 'Parcel delivery' },
      { id: 'storage', name: 'Storage Solutions', emoji: '🏪', description: 'Temporary storage' },
      { id: 'junk_removal', name: 'Junk Removal', emoji: '🗑️', description: 'Waste & debris removal' },
    ],
  },

  // ✨ SPECIAL & UNIQUE SERVICES
  {
    id: 'special_services',
    title: 'Special & Unique',
    subtitle: 'Rare talents & arts',
    emoji: '✨',
    color: '#FBBF24',
    skills: [
      { id: 'astrology', name: 'Astrology', emoji: '🔮', description: 'Horoscope & predictions' },
      { id: 'vastu', name: 'Vastu Consultant', emoji: '🏛️', description: 'Vastu shastra advice' },
      { id: 'tarot', name: 'Tarot Reading', emoji: '🃏', description: 'Card readings' },
      { id: 'numerology', name: 'Numerology', emoji: '🔢', description: 'Number analysis' },
      { id: 'pandit', name: 'Pandit Services', emoji: '🙏', description: 'Puja & rituals' },
      { id: 'wedding_priest', name: 'Wedding Priest', emoji: '💒', description: 'Marriage ceremonies' },
      { id: 'interior_consult', name: 'Interior Design', emoji: '🏠', description: 'Design consulting' },
      { id: 'feng_shui', name: 'Feng Shui', emoji: '☯️', description: 'Energy balancing' },
      { id: 'handwriting', name: 'Handwriting Expert', emoji: '✍️', description: 'Calligraphy & analysis' },
      { id: 'restoration', name: 'Antique Restoration', emoji: '🏺', description: 'Vintage item repair' },
      { id: 'notary', name: 'Notary Service', emoji: '📜', description: 'Document attestation' },
      { id: 'translation', name: 'Translation', emoji: '🌐', description: 'Language translation' },
    ],
  },

  // 👶 CARE SERVICES
  {
    id: 'care_services',
    title: 'Care Services',
    subtitle: 'Caring for loved ones',
    emoji: '👶',
    color: '#14B8A6',
    skills: [
      { id: 'babysitting', name: 'Babysitting', emoji: '👶', description: 'Child care service' },
      { id: 'nanny', name: 'Nanny', emoji: '👩‍👧', description: 'Full-time child care' },
      { id: 'elder_care', name: 'Elder Care', emoji: '👴', description: 'Senior citizen care' },
      { id: 'nurse_care', name: 'Home Nursing', emoji: '👩‍⚕️', description: 'Medical assistance' },
      { id: 'companion', name: 'Companionship', emoji: '🤝', description: 'Social companion' },
      { id: 'patient_attendant', name: 'Patient Attendant', emoji: '🏥', description: 'Hospital assistance' },
      { id: 'new_mom', name: 'New Mom Care', emoji: '🤱', description: 'Postnatal care' },
    ],
  },
];

// Experience Levels
export const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', years: '0-1 years', emoji: '🌱', color: '#22C55E', description: 'Just starting out' },
  { id: 'intermediate', label: 'Intermediate', years: '1-3 years', emoji: '🌿', color: '#3B82F6', description: 'Growing experience' },
  { id: 'expert', label: 'Expert', years: '3-5 years', emoji: '🌳', color: '#8B5CF6', description: 'Highly skilled' },
  { id: 'master', label: 'Master', years: '5+ years', emoji: '👑', color: '#F59E0B', description: 'Industry veteran' },
];

// Service Areas
export const SERVICE_AREAS = [
  { id: '5km', label: '5 km', description: 'Nearby areas only', emoji: '📍' },
  { id: '10km', label: '10 km', description: 'Local city area', emoji: '🏙️' },
  { id: '25km', label: '25 km', description: 'Extended metro area', emoji: '🌆' },
  { id: 'city', label: 'Entire City', description: 'City-wide service', emoji: '🗺️' },
];

// Social Platforms
export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F', placeholder: '@username or profile URL' },
  { id: 'youtube', name: 'YouTube', icon: 'logo-youtube', color: '#FF0000', placeholder: 'Channel URL' },
  { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2', placeholder: 'Profile or Page URL' },
  { id: 'twitter', name: 'Twitter/X', icon: 'logo-twitter', color: '#000000', placeholder: '@username or profile URL' },
  { id: 'website', name: 'Website', icon: 'globe-outline', color: '#6366F1', placeholder: 'https://your-website.com' },
];

// Helper to get category by skill ID
export const getCategoryBySkillId = (skillId: string) => {
  for (const category of SKILL_CATEGORIES) {
    if (category.skills.some(s => s.id === skillId)) {
      return category;
    }
  }
  return null;
};

// Helper to get skill by ID
export const getSkillById = (skillId: string) => {
  for (const category of SKILL_CATEGORIES) {
    const skill = category.skills.find(s => s.id === skillId);
    if (skill) return { ...skill, categoryId: category.id, categoryName: category.title };
  }
  return null;
};
