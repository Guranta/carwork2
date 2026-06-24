import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import Login from './pages/Login';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-100 font-sans">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/policies" element={<PrivateRoute><Policies /></PrivateRoute>} />
        <Route path="/policies/:id" element={<PrivateRoute><PolicyDetail /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/policies" replace />} />
      </Routes>
    </div>
  );
}
