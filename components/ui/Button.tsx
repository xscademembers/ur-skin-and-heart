import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold tracking-wide rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20";
  
  const variants = {
    primary: "bg-brand-blue text-white hover:bg-brand-blueLight shadow-soft",
    outline: "border-2 border-brand-blue text-brand-blue hover:bg-brand-blue/5 bg-transparent",
    ghost: "text-brand-blue hover:bg-brand-blue/5 bg-transparent px-4"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};