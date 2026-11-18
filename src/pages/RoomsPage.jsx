import { ArrowLeft, Droplets, Thermometer, Zap } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import ActivityItem from '../components/ActivityItem.jsx';
import DeviceCard from '../components/DeviceCard.jsx';
import RoomCard from '../components/RoomCard.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { rooms } from '../data/rooms.js';
import { useDevices } from '../state/DeviceProvider.jsx';

export default function RoomsPage() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get('room');
  const selectedRoom = rooms.find((room) => room.id === selectedId);
  const { devices, activity, toggleDevice, updateDeviceSettings } = useDevices();
  const roomDevices = selectedRoom ? devices.filter((device) => device.room === selectedRoom.name) : [];

  if (selectedRoom) {
    return (
      <div className="rooms-page">
        <Link className="back-link" to="/rooms"><ArrowLeft size={15} /> All rooms</Link>
        <div className="room-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(25,40,32,.58), rgba(25,40,32,.05)), url(${selectedRoom.image})` }}>
          <div className="room-detail-copy"><StatusIndicator tone="light">A room in your home</StatusIndicator><h1>{selectedRoom.name}</h1><p>{selectedRoom.caption}</p></div>
          <span className="room-detail-temp"><Thermometer size={16} />{selectedRoom.temperature}°C</span>
        </div>
        <div className="room-detail-metrics">
          <div><Thermometer size={17} /><span><small>Temperature</small><strong>{selectedRoom.temperature}°C</strong></span></div>
          <div><Droplets size={17} /><span><small>Humidity</small><strong>{selectedRoom.humidity}%</strong></span></div>
          <div><Zap size={17} /><span><small>Energy today · demo</small><strong>{selectedRoom.energyToday.toFixed(1)} kWh</strong></span></div>
        </div>
        <section className="content-section room-detail-devices">
          <div className="section-heading"><div><p className="eyebrow">ROOM CONTROLS · SIMULATED</p><h2>Devices in {selectedRoom.name}</h2></div><StatusIndicator tone="sage">{roomDevices.filter((device) => device.isOn).length} on</StatusIndicator></div>
          <div className="device-grid">{roomDevices.map((device) => <DeviceCard key={device.id} device={device} onToggle={toggleDevice} onSettingsChange={updateDeviceSettings} />)}</div>
        </section>
        <section className="room-recent-activity"><div className="section-heading"><div><p className="eyebrow">THE LATEST</p><h2>In this room</h2></div></div><div className="activity-list">{activity.filter((item) => item.detail?.includes(selectedRoom.name)).slice(0, 3).map((item) => <ActivityItem key={item.id} item={item} />)}{activity.filter((item) => item.detail?.includes(selectedRoom.name)).length === 0 && <p className="empty-inline">Your room’s next little update will appear here.</p>}</div></section>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      <PageHeading eyebrow="THE SPACES YOU SHARE" title="Rooms" description="Every room has its own rhythm. Choose one to see its simulated comfort readings and controls." action={<StatusIndicator tone="neutral">{rooms.length} spaces</StatusIndicator>} />
      <div className="room-grid room-grid-page">{rooms.map((room) => <RoomCard key={room.id} room={room} devices={devices} />)}</div>
      <div className="room-note"><span className="room-note-mark">i</span><p>Room photographs are illustrative; temperature, humidity, and energy readings are simulated locally and are not connected to home hardware.</p></div>
    </div>
  );
}
