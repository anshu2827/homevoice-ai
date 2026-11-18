import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import ActivityPage from './pages/ActivityPage.jsx';
import AutomationsPage from './pages/AutomationsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DevicesPage from './pages/DevicesPage.jsx';
import EnergyPage from './pages/EnergyPage.jsx';
import RoomsPage from './pages/RoomsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import VoicePage from './pages/VoicePage.jsx';
import { DeviceProvider } from './state/DeviceProvider.jsx';
import { ToastProvider } from './state/ToastProvider.jsx';

export default function App() {
  return (
    <DeviceProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/rooms" element={<RoomsPage />} />
              <Route path="/devices" element={<DevicesPage />} />
              <Route path="/voice" element={<VoicePage />} />
              <Route path="/automations" element={<AutomationsPage />} />
              <Route path="/energy" element={<EnergyPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </ToastProvider>
    </DeviceProvider>
  );
}
