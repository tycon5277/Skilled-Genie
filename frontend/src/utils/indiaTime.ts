// Indian Timezone Utilities
// IST = UTC+5:30

export const INDIA_TIMEZONE = 'Asia/Kolkata';

// Get current time in India
export const getIndiaTime = (): Date => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: INDIA_TIMEZONE }));
};

// Get current hour in India (0-23)
export const getIndiaHour = (): number => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: INDIA_TIMEZONE,
    hour: 'numeric',
    hour12: false,
  };
  return parseInt(new Date().toLocaleString('en-US', options), 10);
};

// Format date in Indian format (DD/MM/YYYY)
export const formatIndiaDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    timeZone: INDIA_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Format time in Indian format (12-hour with AM/PM)
export const formatIndiaTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-IN', {
    timeZone: INDIA_TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Format date and time together
export const formatIndiaDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-IN', {
    timeZone: INDIA_TIMEZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// Get greeting based on Indian time
export const getIndiaGreeting = (): string => {
  const hour = getIndiaHour();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Format relative date (Today, Yesterday, or date)
export const formatRelativeDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = getIndiaTime();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const dateStr = d.toLocaleDateString('en-IN', { timeZone: INDIA_TIMEZONE });
  const todayStr = today.toLocaleDateString('en-IN', { timeZone: INDIA_TIMEZONE });
  const yesterdayStr = yesterday.toLocaleDateString('en-IN', { timeZone: INDIA_TIMEZONE });

  if (dateStr === todayStr) return 'Today';
  if (dateStr === yesterdayStr) return 'Yesterday';
  return formatIndiaDate(d);
};

// Format day name for schedule
export const formatIndiaDayName = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    timeZone: INDIA_TIMEZONE,
    weekday: 'short',
  });
};

// Format full date for schedule header
export const formatIndiaFullDate = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    timeZone: INDIA_TIMEZONE,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

// Get week days starting from today (in IST)
export const getIndiaWeekDays = (): Date[] => {
  const days: Date[] = [];
  const today = getIndiaTime();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    days.push(date);
  }
  return days;
};

// Check if date is today (in IST)
export const isIndiaToday = (date: Date): boolean => {
  const today = getIndiaTime();
  return date.toDateString() === today.toDateString();
};
