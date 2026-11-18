import { useState } from 'react';
import { ArrowRight, Clock3, MoonStar, Sunrise, SunMedium, WandSparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ToggleControl from '../components/ToggleControl.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { useStoredState } from '../hooks/useStoredState.js';
import { useDevices } from '../state/DeviceProvider.jsx';
import { useToast } from '../state/ToastProvider.jsx';

const iconByKey = { sunrise: Sunrise, sun: SunMedium, moon: MoonStar };
const starterAutomations = [
  { id: 'morning-light', name: 'A gentle good morning', time: 'Weekdays · 7:00 AM', iconKey: 'sunrise', detail: 'Let the bedroom light rise slowly with the day.', enabled: true },
  { id: 'home-arrival', name: 'Welcome home', time: 'When you arrive · simulated', iconKey: 'sun', detail: 'Settle the living room lights into a warm glow.', enabled: false },
  { id: 'wind-down', name: 'An easy wind-down', time: 'Every evening · 9:30 PM', iconKey: 'moon', detail: 'Dim the lights and invite a quieter evening.', enabled: true },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = useStoredState('homevoice.automations.v1', starterAutomations);
  const { recordActivity, devices } = useDevices();
  const showToast = useToast();
  const [showIdeas, setShowIdeas] = useState(false);

  function toggleAutomation(id) {
    const item = automations.find((automation) => automation.id === id);
    if (!item) return;
    const next = automations.map((automation) => automation.id === id ? { ...automation, enabled: !automation.enabled } : automation);
    setAutomations(next);
    recordActivity(`${item.name} ${item.enabled ? 'paused' : 'enabled'}`, 'Automation preference saved in this browser', 'automation');
    showToast(`${item.name} ${item.enabled ? 'paused' : 'enabled'} in the demo.`);
  }

  return (
    <div className="automations-page">
      <PageHeading eyebrow="A LITTLE ROUTINE GOES A LONG WAY" title="Automations" description="A foundation for the routines you might build later. These switches save a local demo preference only." action={<StatusIndicator tone="neutral">Demo rules</StatusIndicator>} />
      <div className="automation-summary"><div className="automation-summary-icon"><WandSparkles size={20} /></div><div><strong>{automations.filter((item) => item.enabled).length} little routines in mind</strong><span>Local-only routines; {devices.length} demo devices remain shared across pages.</span></div><span className="automation-summary-mark">LOCAL</span></div>
      <div className="automation-list">{automations.map((item) => {
        const Icon = iconByKey[item.iconKey] || WandSparkles;
        return <article className="automation-card" key={item.id}><span className="automation-icon"><Icon size={19} /></span><div className="automation-copy"><div className="automation-title-row"><h2>{item.name}</h2><StatusIndicator tone={item.enabled ? 'sage' : 'neutral'}>{item.enabled ? 'On' : 'Paused'}</StatusIndicator></div><p className="automation-time"><Clock3 size={14} />{item.time}</p><p className="automation-description">{item.detail}</p></div><ToggleControl checked={item.enabled} onChange={() => toggleAutomation(item.id)} label={`${item.enabled ? 'Pause' : 'Enable'} ${item.name}`} /></article>;
      })}</div>
      <section className={`automation-idea-card ${showIdeas ? 'is-expanded' : ''}`}><div><p className="eyebrow">WHEN YOU'RE READY</p><h2>Make room for a little magic.</h2><p>Schedules, conditions, and real device actions belong to a future integration phase.</p></div><button className="secondary-button" type="button" onClick={() => setShowIdeas((value) => !value)}>{showIdeas ? 'Hide ideas' : 'See what could come next'} <ArrowRight size={15} /></button>{showIdeas && <div className="automation-ideas"><span>Sunset lighting</span><span>Comfort on arrival</span><span>Quiet night mode</span></div>}<Link className="automation-inline-link" to="/devices">Browse current demo devices <ArrowRight size={14} /></Link></section>
    </div>
  );
}
