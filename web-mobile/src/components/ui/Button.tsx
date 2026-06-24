import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'text' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  block = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-[#00B96B] text-white shadow-sm',
    secondary: 'bg-white text-[#00B96B] border border-[#00B96B]',
    text: 'text-[#00B96B] bg-transparent',
    danger: 'bg-[#FF4D4F] text-white',
  };
  const sizes: Record<string, string> = {
    sm: 'h-9 px-4 text-sm rounded-lg',
    md: 'h-11 px-5 text-base rounded-xl',
    lg: 'h-13 px-6 text-base rounded-xl py-3.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} font-semibold inline-flex items-center justify-center gap-1.5 transition-opacity ${
        disabled ? 'opacity-40 cursor-not-allowed' : ''
      } ${block ? 'w-full' : ''} ${className}`}
    >
      {children}
    </motion.button>
  );
}
