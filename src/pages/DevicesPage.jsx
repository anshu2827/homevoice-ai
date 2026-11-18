import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DeviceCard from '../components/DeviceCard.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { useDevices } from '../state/DeviceProvider.jsx';

const categories = [
  { id: 'all', label: 'All devices' },
  { id: 'light', label: 'Lighting' },
  { id: 'climate', label: 'Climate' },
  { id: 'fan', label: 'Fans' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'plug', label: 'Plugs' },
];

export default function DevicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { devices, toggleDevice, updateDeviceSettings } = useDevices();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('all');
  useEffect(() => setSearch(searchParams.get('search') || ''), [searchParams]);

  const filtered = useMemo(() => devices.filter((device) => {
    const matchesText = `${device.name} ${device.room} ${device.category}`.toLowerCase().includes(search.trim().toLowerCase());
    return matchesText && (category === 'all' || device.category === category);
  }), [devices, search, category]);

  function updateSearch(value) {
    setSearch(value);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set('search', value.trim());
    else next.delete('search');
    setSearchParams(next, { replace: true });
  }

  return (
    <div className="devices-page">
      <PageHeading eyebrow="SMALL THINGS, AT YOUR FINGERTIPS" title="Devices" description="Your simulated home controls, gathered in one place." action={<StatusIndicator tone="forest">{devices.filter((device) => device.isOn).length} active</StatusIndicator>} />
      <div className="device-toolbar">
        <div className="device-filter-tabs" role="tablist" aria-label="Filter device category">
          {categories.map((item) => <button key={item.id} type="button" role="tab" aria-selected={category === item.id} className={category === item.id ? 'filter-tab active' : 'filter-tab'} onClick={() => setCategory(item.id)}>{item.label}</button>)}
        </div>
        <div className="device-result-count"><SlidersHorizontal size={15} />{filtered.length} shown</div>
      </div>
      {search && <div className="search-result-note">Showing results for <strong>“{search}”</strong><button type="button" onClick={() => updateSearch('')} aria-label="Clear device search"><X size={14} /></button></div>}
      {filtered.length ? (
        <div className="device-grid devices-page-grid">{filtered.map((device) => <DeviceCard key={device.id} device={device} onToggle={toggleDevice} onSettingsChange={updateDeviceSettings} />)}</div>
      ) : (
        <div className="empty-state"><span className="empty-state-icon"><SlidersHorizontal size={21} /></span><h2>No devices found</h2><p>Try a different name, room, or category.</p><button className="secondary-button" type="button" onClick={() => { updateSearch(''); setCategory('all'); }}>Clear filters</button></div>
      )}
      <div className="simulated-note">These controls change local demo state only. No physical devices are connected.</div>
    </div>
  );
}
