import { ArrowRight, ArrowUpRight, BatteryCharging, Check, Leaf, Sun, Thermometer, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import ActivityItem from '../components/ActivityItem.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import RoomCard from '../components/RoomCard.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import VoiceAssistantPanel from '../components/VoiceAssistantPanel.jsx';
import { rooms } from '../data/rooms.js';
import { useDevices } from '../state/DeviceProvider.jsx';
import { formatDate, greetingForHour } from '../utils/formatters.js';

export default function DashboardPage() {
  const { devices, activity, toggleDevice, updateDeviceSettings } = useDevices();
  const activeCount = devices.filter((device) => device.isOn).length;
  const totalEnergy = rooms.reduce((sum, room) => sum + room.energyToday, 0);
  const averageTemperature = Math.round(rooms.reduce((sum, room) => sum + room.temperature, 0) / rooms.length);

  return (
    <div className="dashboard-page">
      <PageHeading eyebrow={formatDate(new Date()).toUpperCase()} title={`${greetingForHour()}, your home is in good rhythm.`} description="A thoughtful little overview of how things feel at home today." />

      <section className="welcome-card">
        <div className="welcome-card-copy">
          <span className="welcome-kicker"><span className="welcome-sun"><Sun size={15} /></span> YOUR HOME, AT A GLANCE</span>
          <h2>Everything in its<br /><em>right place.</em></h2>
          <p>{activeCount} of {devices.length} simulated devices are on across {rooms.length} rooms. Controls on this page update this browser demo only.</p>
          <StatusIndicator tone="forest">Home looks settled</StatusIndicator>
        </div>
        <div className="welcome-card-art" aria-hidden="true">
          <div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" />
          <div className="welcome-art-seal"><span className="seal-leaf"><Leaf size={22} /></span><strong>{activeCount}<small>of {devices.length}</small></strong><span className="seal-caption">devices awake</span></div>
          <span className="welcome-art-spark spark-a">✳</span><span className="welcome-art-spark spark-b">✦</span>
        </div>
        <div className="welcome-footnote"><span><span className="footnote-dot" />LOCAL DEMO</span><span>Last refreshed just now</span></div>
      </section>

      <div className="dashboard-columns">
        <div className="dashboard-main">
          <section className="content-section">
            <div className="section-heading">
              <div><p className="eyebrow">SPACES THAT FEEL LIKE HOME</p><h2>Your rooms</h2></div>
              <Link className="text-link" to="/rooms">All rooms <ArrowRight size={15} /></Link>
            </div>
            <div className="room-grid">
              {rooms.map((room) => <RoomCard key={room.id} room={room} devices={devices} />)}
            </div>
          </section>

          <section className="content-section device-overview-section">
            <div className="section-heading">
              <div><p className="eyebrow">A FEW THOUGHTFUL TOUCHES</p><h2>Device controls <span className="section-count">{devices.length}</span></h2></div>
              <Link className="text-link" to="/devices">See all devices <ArrowRight size={15} /></Link>
            </div>
            <div className="device-grid dashboard-device-grid">
              {devices.map((device) => <DeviceCard key={device.id} device={device} onToggle={toggleDevice} onSettingsChange={updateDeviceSettings} compact />)}
            </div>
          </section>
        </div>

        <aside className="dashboard-rail">
          <section className="energy-summary-card">
            <div className="rail-card-heading"><span className="rail-icon rail-icon-energy"><Zap size={17} /></span><span className="rail-status">TODAY · DEMO ESTIMATE</span></div>
            <p className="eyebrow">A LIGHTER FOOTPRINT</p>
            <div className="energy-number">{totalEnergy.toFixed(1)} <span>kWh</span></div>
            <div className="energy-subline"><span className="energy-change"><ArrowUpRight size={13} /> 8% less</span><span>than yesterday</span></div>
            <div className="energy-sparkline" aria-label="Illustrative energy use, not live metering">
              {[32, 50, 40, 67, 45, 79, 55, 88, 59, 72, 42, 63, 48, 76, 53, 68, 41, 60].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}
            </div>
            <div className="energy-chart-labels"><span>12 AM</span><span>NOW</span></div>
            <Link className="rail-link" to="/energy">See energy details <ArrowUpRight size={14} /></Link>
          </section>

          <div className="comfort-card">
            <div className="comfort-heading"><span className="rail-icon rail-icon-temperature"><Thermometer size={17} /></span><span>INSIDE, ON AVERAGE</span></div>
            <div className="comfort-reading">{averageTemperature}<sup>°</sup><span>C</span></div>
            <p>Just right in your rooms</p>
            <div className="comfort-bottom"><span><BatteryCharging size={14} /> Home comfort</span><span>Balanced</span></div>
          </div>

          <VoiceAssistantPanel />

          <section className="activity-preview-card">
            <div className="section-heading compact-heading"><div><p className="eyebrow">THE LITTLE THINGS</p><h2>Recent activity</h2></div><Link className="round-link" to="/activity" aria-label="See activity history"><ArrowUpRight size={16} /></Link></div>
            <div className="activity-list compact-activity-list">{activity.slice(0, 3).map((item) => <ActivityItem key={item.id} item={item} />)}</div>
            <Link className="activity-all-link" to="/activity">View activity <ArrowRight size={14} /></Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
