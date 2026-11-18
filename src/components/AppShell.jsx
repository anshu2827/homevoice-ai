import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, AudioLines, Bell, ChevronRight, House, Leaf, Lightbulb,
  Search, Settings2, Sparkles, Wind, Zap,
} from 'lucide-react';
import { useDevices } from '../state/DeviceProvider.jsx';
import { useToast } from '../state/ToastProvider.jsx';
import { useStoredState } from '../hooks/useStoredState.js';
import { StatusIndicator } from './StatusIndicator.jsx';

const navigation = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/rooms', label: 'Rooms', icon: Leaf },
  { to: '/devices', label: 'Devices', icon: Lightbulb },
  { to: '/voice', label: 'Voice assistant', icon: AudioLines },
  { to: '/automations', label: 'Automations', icon: Sparkles },
  { to: '/energy', label: 'Energy', icon: Zap },
  { to: '/activity', label: 'Activity', icon: Activity },
];

const pageNames = {
  '/': 'Home',
  '/rooms': 'Rooms',
  '/devices': 'Devices',
  '/voice': 'Voice assistant',
  '/automations': 'Automations',
  '/energy': 'Energy monitoring',
  '/activity': 'Activity history',
  '/settings': 'Settings',
};

export default function AppShell({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showToast = useToast();
  const { devices } = useDevices();
  const [search, setSearch] = useState('');
  const [preferences] = useStoredState('homevoice.preferences.v1', { showDemoLabels: true, gentleTransitions: true });
  const activeCount = devices.filter((device) => device.isOn).length;
  const pageTitle = pageNames[location.pathname] || 'Home';

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/devices?search=${encodeURIComponent(query)}` : '/devices');
  }

  return (
    <div className={`app-shell ${preferences.gentleTransitions ? '' : 'reduced-motion'}`}>
      <aside className="sidebar">
        <NavLink className="brand-lockup" to="/" aria-label="HomeVoice AI home">
          <span className="brand-mark"><img src="/homevoice-mark.svg" alt="" /></span>
          <span className="brand-name">homevoice<span>AI</span></span>
        </NavLink>

        <div className="sidebar-section-label">YOUR HOME</div>
        <nav className="primary-navigation" aria-label="Main navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {to === '/devices' && <span className="nav-count">{activeCount}</span>}
              {to === '/activity' && <ChevronRight className="nav-chevron" size={14} />}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="sidebar-note-icon"><Wind size={16} /></span>
            <div><strong>A little more calm</strong><span>One home, in harmony.</span></div>
          </div>
          <NavLink to="/settings" className={({ isActive }) => `nav-link settings-link ${isActive ? 'active' : ''}`}>
            <Settings2 size={18} strokeWidth={1.8} /><span>Settings</span>
          </NavLink>
          <div className="sidebar-mode"><span className="mode-orb" /><span>Demo home</span><span className="mode-caption">SIMULATED</span></div>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-location"><span>My home</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div>
          <div className="topbar-tools">
            <form className="search-form hidden sm:flex" onSubmit={submitSearch} role="search">
              <Search size={16} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a device" aria-label="Find a device" />
            </form>
            <button className="icon-button notification-button" type="button" aria-label="Show home status" onClick={() => showToast(`${activeCount} of ${devices.length} demo devices are on.`)}>
              <Bell size={18} strokeWidth={1.8} /><span className="notification-dot" />
            </button>
            <button className="profile-button" type="button" onClick={() => navigate('/settings')} aria-label="Open settings">
              <span className="profile-initial">H</span><span className="profile-meta"><strong>Home</strong><small>Residence</small></span>
            </button>
          </div>
        </header>

        <main className="page-content min-h-screen">{children}</main>
        <footer className="app-footer">
          <span>HOMEVOICE AI</span><span className="footer-separator">·</span><span>For a home that feels like yours</span>
          <StatusIndicator tone="neutral">Simulated controls</StatusIndicator>
        </footer>
      </div>
    </div>
  );
}
