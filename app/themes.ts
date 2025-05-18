export type ThemeColor = 'teal' | 'rose' | 'amber' | 'indigo' | 'emerald';

export interface Theme {
  id: ThemeColor;
  name: string;
  light: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardHover: string;
    border: string;
    buttonText: string;
  };
  dark: {
    primary: string;
    primaryHover: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    card: string;
    cardHover: string;
    border: string;
    buttonText: string;
  };
}

export const themes: Record<ThemeColor, Theme> = {
  teal: {
    id: 'teal',
    name: 'Ocean Breeze',
    light: {
      primary: 'bg-teal-600',
      primaryHover: 'bg-teal-700',
      secondary: 'bg-sky-500',
      accent: 'bg-teal-500/20',
      background: 'bg-white',
      foreground: 'text-gray-900',
      muted: 'bg-gray-100',
      mutedForeground: 'text-gray-600',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      border: 'border-gray-200',
      buttonText: 'text-white',
    },
    dark: {
      primary: 'bg-teal-500',
      primaryHover: 'bg-teal-600',
      secondary: 'bg-sky-600',
      accent: 'bg-teal-600/30',
      background: 'bg-gray-950',
      foreground: 'text-gray-50',
      muted: 'bg-gray-800/50',
      mutedForeground: 'text-gray-400',
      card: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      buttonText: 'text-gray-50',
    }
  },
  rose: {
    id: 'rose',
    name: 'Sunset Journey',
    light: {
      primary: 'bg-rose-500',
      primaryHover: 'bg-rose-600',
      secondary: 'bg-orange-400',
      accent: 'bg-rose-500/20',
      background: 'bg-white',
      foreground: 'text-gray-900',
      muted: 'bg-gray-100',
      mutedForeground: 'text-gray-600',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      border: 'border-gray-200',
      buttonText: 'text-white',
    },
    dark: {
      primary: 'bg-rose-500',
      primaryHover: 'bg-rose-600',
      secondary: 'bg-orange-500',
      accent: 'bg-rose-600/30',
      background: 'bg-gray-950',
      foreground: 'text-gray-50',
      muted: 'bg-gray-800/50',
      mutedForeground: 'text-gray-400',
      card: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      buttonText: 'text-gray-50',
    }
  },
  amber: {
    id: 'amber',
    name: 'Golden Memories',
    light: {
      primary: 'bg-amber-500',
      primaryHover: 'bg-amber-600',
      secondary: 'bg-orange-400',
      accent: 'bg-amber-500/20',
      background: 'bg-white',
      foreground: 'text-gray-900',
      muted: 'bg-gray-100',
      mutedForeground: 'text-gray-600',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      border: 'border-gray-200',
      buttonText: 'text-white',
    },
    dark: {
      primary: 'bg-amber-500',
      primaryHover: 'bg-amber-600',
      secondary: 'bg-orange-500',
      accent: 'bg-amber-600/30',
      background: 'bg-gray-950',
      foreground: 'text-gray-50',
      muted: 'bg-gray-800/50',
      mutedForeground: 'text-gray-400',
      card: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      buttonText: 'text-gray-50',
    }
  },
  indigo: {
    id: 'indigo',
    name: 'Twilight Voyage',
    light: {
      primary: 'bg-indigo-600',
      primaryHover: 'bg-indigo-700',
      secondary: 'bg-violet-500',
      accent: 'bg-indigo-500/20',
      background: 'bg-white',
      foreground: 'text-gray-900',
      muted: 'bg-gray-100',
      mutedForeground: 'text-gray-600',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      border: 'border-gray-200',
      buttonText: 'text-white',
    },
    dark: {
      primary: 'bg-indigo-500',
      primaryHover: 'bg-indigo-600',
      secondary: 'bg-violet-500',
      accent: 'bg-indigo-600/30',
      background: 'bg-gray-950',
      foreground: 'text-gray-50',
      muted: 'bg-gray-800/50',
      mutedForeground: 'text-gray-400',
      card: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      buttonText: 'text-gray-50',
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Tropical Paradise',
    light: {
      primary: 'bg-emerald-600',
      primaryHover: 'bg-emerald-700',
      secondary: 'bg-green-500',
      accent: 'bg-emerald-500/20',
      background: 'bg-white',
      foreground: 'text-gray-900',
      muted: 'bg-gray-100',
      mutedForeground: 'text-gray-600',
      card: 'bg-white',
      cardHover: 'hover:bg-gray-50',
      border: 'border-gray-200',
      buttonText: 'text-white',
    },
    dark: {
      primary: 'bg-emerald-500',
      primaryHover: 'bg-emerald-600',
      secondary: 'bg-green-500',
      accent: 'bg-emerald-600/30',
      background: 'bg-gray-950',
      foreground: 'text-gray-50',
      muted: 'bg-gray-800/50',
      mutedForeground: 'text-gray-400',
      card: 'bg-gray-900',
      cardHover: 'hover:bg-gray-800',
      border: 'border-gray-800',
      buttonText: 'text-gray-50',
    }
  },
};

export const defaultTheme: ThemeColor = 'teal';

// Helper function to get theme CSS classes
export const getThemeClasses = (theme: ThemeColor, isDark: boolean): string => {
  const selectedTheme = themes[theme] || themes[defaultTheme];
  const mode = isDark ? selectedTheme.dark : selectedTheme.light;
  return `
    theme-${theme} 
    ${isDark ? 'dark' : 'light'}
  `;
}; 