import { ArrowUpRight, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoomCard({ room, devices }) {
  const roomDevices = devices.filter((device) => device.room === room.name);
  const activeCount = roomDevices.filter((device) => device.isOn).length;

  return (
    <Link className="room-card" to={`/rooms?room=${encodeURIComponent(room.id)}`}>
      <div className="room-image-wrap">
        <img className="room-image" src={room.image} alt={`${room.name} interior`} loading="lazy" />
        <span className="room-device-count">{activeCount} of {roomDevices.length} on</span>
        <span className="room-open-icon"><ArrowUpRight size={17} /></span>
      </div>
      <div className="room-card-copy">
        <div><h3>{room.name}</h3><p>{room.caption}</p></div>
        <span className="room-temperature"><Thermometer size={15} />{room.temperature}°</span>
      </div>
    </Link>
  );
}
