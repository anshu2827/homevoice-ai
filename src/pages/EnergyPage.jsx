import { ArrowDownRight, ArrowUpRight, Leaf, Lightbulb, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { rooms } from '../data/rooms.js';
import { useDevices } from '../state/DeviceProvider.jsx';

const bars = [31, 44, 39, 58, 46, 70, 53, 64, 48, 81, 58, 66, 43, 73, 50, 88, 59, 76, 45, 67, 54, 83, 62, 72, 47, 69, 56, 79];

export default function EnergyPage() {
  const { devices } = useDevices();
  const total = rooms.reduce((sum, room) => sum + room.energyToday, 0);
  const activeCount = devices.filter((device) => device.isOn).length;
  return (
    <div className="energy-page">
      <PageHeading eyebrow="GENTLER HABITS, BETTER VISIBILITY" title="Energy monitoring" description="A considered place for your home's energy story. Current readings are realistic demo estimates, not live meter data." action={<StatusIndicator tone="neutral">{activeCount} devices on</StatusIndicator>} />
      <div className="energy-top-grid">
        <section className="energy-feature-card"><div className="energy-feature-top"><span className="energy-feature-icon"><Zap size={19} /></span><span className="energy-feature-label">TODAY · ESTIMATE</span></div><p className="eyebrow">SIMULATED HOUSEHOLD USE</p><div className="energy-feature-number">{total.toFixed(1)} <span>kWh</span></div><p className="energy-feature-caption"><span><ArrowDownRight size={14} /> 8%</span> lower than yesterday's sample</p><div className="large-energy-chart" aria-label="Illustrative use through the day">{bars.map((height, index) => <i key={index} className={index > 22 ? 'bar-future' : ''} style={{ height: `${height}%` }} />)}</div><div className="large-energy-labels"><span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>NOW</span></div></section>
        <div className="energy-side-stack"><section className="energy-side-stat"><span className="side-stat-icon"><Leaf size={17} /></span><p className="eyebrow">WEEKLY PACE</p><strong>42.8 <small>kWh</small></strong><span className="stat-caption"><ArrowDownRight size={13} /> A little gentler than last week</span></section><section className="energy-side-stat energy-cost-card"><span className="side-stat-icon"><Lightbulb size={17} /></span><p className="eyebrow">POTENTIAL SAVING</p><strong>$3.20</strong><span className="stat-caption">Illustrative sample estimate</span></section></div>
      </div>
      <section className="content-section energy-room-section"><div className="section-heading"><div><p className="eyebrow">A CLOSER LOOK</p><h2>By room</h2></div><span className="energy-period-pill">Today · demo</span></div><div className="energy-room-list">{rooms.map((room, index) => <div className="energy-room-row" key={room.id}><span className={`energy-room-index room-index-${index + 1}`}>0{index + 1}</span><div className="energy-room-name"><strong>{room.name}</strong><span>{index === 0 ? 'Soft, steady light' : index === 1 ? 'Comfort & atmosphere' : 'Everyday essentials'}</span></div><div className="energy-room-meter"><span style={{ width: `${Math.round(room.energyToday / total * 100)}%` }} /></div><strong className="energy-room-value">{room.energyToday.toFixed(1)} <small>kWh</small></strong></div>)}</div></section>
      <div className="energy-disclaimer"><StatusIndicator tone="neutral">Illustrative data</StatusIndicator><p>No live meter, utility account, or hardware integration is connected. Energy figures are sample values for the app foundation.</p><Link to="/devices">View devices <ArrowUpRight size={14} /></Link></div>
    </div>
  );
}
