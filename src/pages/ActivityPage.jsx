import { useMemo, useState } from 'react';
import { Activity, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ActivityItem from '../components/ActivityItem.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { useDevices } from '../state/DeviceProvider.jsx';

const filters = [
  { value: 'all', label: 'Everything' },
  { value: 'device', label: 'Device changes' },
  { value: 'automation', label: 'Routines' },
  { value: 'home', label: 'Home notes' },
];

export default function ActivityPage() {
  const { activity, devices } = useDevices();
  const [filter, setFilter] = useState('all');
  const filtered = useMemo(() => activity.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'automation') return item.kind === 'automation';
    if (filter === 'home') return item.kind === 'home';
    return item.kind !== 'automation' && item.kind !== 'home';
  }), [activity, filter]);

  return (
    <div className="activity-page">
      <PageHeading eyebrow="A QUIET RECORD OF THE DAY" title="Activity history" description="Simulated switches, settings changes, and routine preferences leave a small note here." action={<StatusIndicator tone="neutral">{activity.length} entries · {devices.length} devices</StatusIndicator>} />
      <div className="activity-filter-tabs" role="tablist" aria-label="Filter activity history">{filters.map((item) => <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div>
      {filtered.length ? <section className="activity-history-card"><div className="history-card-heading"><span className="history-heading-icon"><Activity size={16} /></span><div><strong>Recent moments</strong><span>Newest first · saved in this browser</span></div><span className="history-local-pill">LOCAL</span></div><div className="activity-list activity-history-list">{filtered.map((item) => <ActivityItem key={item.id} item={item} />)}</div></section> : <div className="empty-state"><span className="empty-state-icon"><Activity size={21} /></span><h2>No matching moments</h2><p>Try another filter. Device changes will appear here.</p><button className="secondary-button" type="button" onClick={() => setFilter('all')}>Show everything</button></div>}
      <div className="activity-footer-note"><span>Looking for your controls?</span><Link to="/devices">Open devices <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}
