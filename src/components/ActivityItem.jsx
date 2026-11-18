import { AirVent, Clock3, Home, Lightbulb, PlugZap, Sparkles, Tv2 } from 'lucide-react';
import { formatRelativeTime } from '../utils/formatters.js';

const iconByKind = {
  climate: AirVent,
  light: Lightbulb,
  plug: PlugZap,
  entertainment: Tv2,
  automation: Sparkles,
  home: Home,
};

export default function ActivityItem({ item }) {
  const Icon = iconByKind[item.kind] || Clock3;
  return (
    <div className="activity-item">
      <span className={`activity-icon activity-icon-${item.kind || 'home'}`}><Icon size={16} strokeWidth={1.8} /></span>
      <div className="activity-copy"><strong>{item.title}</strong><span>{item.detail}</span></div>
      <time dateTime={item.timestamp}>{formatRelativeTime(item.timestamp)}</time>
    </div>
  );
}
