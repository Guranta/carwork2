import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/auth';
import Login from './pages/Login';
import Policies from './pages/Policies';
import PolicyDetail from './pages/PolicyDetail';
import Claims from './pages/Claims';
import ClaimDetail from './pages/ClaimDetail';
import CreateClaim from './pages/CreateClaim';
import NearbyShops from './pages/NearbyShops';
import Notifications from './pages/Notifications';
import Payment from './pages/Payment';
import Review from './pages/Review';

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
        <Route path="/claims" element={<PrivateRoute><Claims /></PrivateRoute>} />
        <Route path="/claims/new" element={<PrivateRoute><CreateClaim /></PrivateRoute>} />
        <Route path="/claims/new/:id" element={<PrivateRoute><CreateClaim /></PrivateRoute>} />
        <Route path="/claims/:id" element={<PrivateRoute><ClaimDetail /></PrivateRoute>} />
        <Route path="/shops/nearby" element={<PrivateRoute><NearbyShops /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
        <Route path="/claims/:id/payment" element={<PrivateRoute><Payment /></PrivateRoute>} />
        <Route path="/claims/:id/review" element={<PrivateRoute><Review /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/policies" replace />} />
      </Routes>
    </div>
  );
}
