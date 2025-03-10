
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SettlementPage from './pages/SettlementPage';
import SettlementsPage from './pages/SettlementsPage';
import ThesisSubmission from './pages/ThesisSubmission';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';
import AppLayout from './components/layout/AppLayout';
import Settings from './pages/Settings';
import ReferralRedirect from './pages/ReferralRedirect';
import ReferralsPage from './pages/ReferralsPage';

export default function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="settlements" element={<SettlementsPage />} />
        <Route path="settlements/:settlementId" element={<SettlementPage />} />
        <Route path="thesis" element={<ThesisSubmission />} />
        <Route path="profile/:profileId" element={<ProfilePage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="referrals" element={<ReferralsPage />} />
        <Route path="r/:referrerAddress" element={<ReferralRedirect />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
