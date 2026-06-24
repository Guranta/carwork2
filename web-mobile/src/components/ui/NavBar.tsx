import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavBarProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
}

export default function NavBar({ title, onBack, right, transparent }: NavBarProps) {
  const navigate = useNavigate();
  return (
    <header
      className={`flex items-center justify-between px-4 h-14 sticky top-0 z-50 ${
        transparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md border-b border-[#F0F0F0]'
      }`}
    >
      <div className="flex items-center gap-1 w-16">
        {onBack !== undefined || title ? (
          <button onClick={() => (onBack ? onBack() : navigate(-1))} className="p-1 -ml-1 active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-[#1A1A1A]" />
          </button>
        ) : null}
      </div>
      <h1 className="text-base font-semibold text-[#1A1A1A] flex-1 text-center truncate">{title}</h1>
      <div className="w-16 flex justify-end">{right}</div>
    </header>
  );
}
