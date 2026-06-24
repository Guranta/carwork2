import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  delay?: number;
}

export default function Card({ children, className = '', onClick, delay = 0 }: CardProps) {
  const Comp: any = onClick ? motion.button : motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] ${onClick ? 'w-full text-left active:scale-[0.98] transition-transform' : ''} ${className}`}
    >
      {children}
    </Comp>
  );
}
