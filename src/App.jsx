import { Routes, Route, Navigate } from 'react-router-dom';
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DealDetailPage from './pages/DealDetailPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';
import WaitlistPage from './pages/WaitlistPage';
import OffersDealsPage from './pages/OffersDealsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/deal/:id" element={<DealDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/waitlist" element={<WaitlistPage />} />
      <Route path="/offers" element={<OffersDealsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
