'use client';

import { ReactNode, MouseEvent } from 'react';
import Icon from './Icon';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../themes';

interface ButtonProps {
  children: ReactNode;
  onClick?: ((e?: MouseEvent<Element>) => void) | (() => void);
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  type = 'button',
  title,
}: ButtonProps) {
  const { theme, isDark } = useTheme();
  
  // Base class
  const baseClass = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };
  
  // Dynamic theme-specific classes
  const getVariantClasses = () => {    
    const variants = {
      primary: `${isDark ? themes[theme].dark.primary : themes[theme].light.primary} ${themes[theme].light.buttonText} hover:${isDark ? themes[theme].dark.primaryHover : themes[theme].light.primaryHover}`,
      secondary: `${isDark ? themes[theme].dark.secondary : themes[theme].light.secondary} ${themes[theme].light.buttonText} hover:opacity-90`,
      outline: `border ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`,
      ghost: `hover:${isDark ? 'bg-gray-800/50' : 'bg-gray-100'}`,
      accent: `bg-blue-500 text-white hover:bg-blue-600 ${isDark ? 'dark:bg-blue-600 dark:hover:bg-blue-700' : ''}`,
    };

    return variants[variant];
  };

  // Focus ring color based on theme
  const focusRingClass = variant === 'accent' ? 'focus:ring-blue-500' : `focus:ring-${theme}-500`;
  
  // Disabled class
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  // Shadow class
  const shadowClass = variant === 'primary' || variant === 'secondary' || variant === 'accent'
    ? isDark ? 'shadow-soft-dark' : 'shadow-soft' 
    : '';
  
  // Combined class
  const combinedClass = `${baseClass} ${sizeClasses[size]} ${getVariantClasses()} ${focusRingClass} ${shadowClass} ${disabledClass} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedClass}
      disabled={disabled}
      title={title}
    >
      {icon && iconPosition === 'left' && <Icon name={icon} size={size === 'lg' ? 20 : 16} className="mr-2" />}
      {children}
      {icon && iconPosition === 'right' && <Icon name={icon} size={size === 'lg' ? 20 : 16} className="ml-2" />}
    </button>
  );
} 