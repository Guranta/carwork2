import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { key: '/policies', label: '保单', icon: '📄' },
  { key: '/claims', label: '理赔', icon: '🔧' },
];

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black border-t-2 border-neutral-800 flex">
      {tabs.map((tab) => {
        const active = location.pathname.startsWith(tab.key);
        return (
          <button
            key={tab.key}
            className={`flex-1 py-3 flex flex-col items-center gap-1 ${active ? 'text-white' : 'text-neutral-600'}`}
            onClick={() => navigate(tab.key)}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
