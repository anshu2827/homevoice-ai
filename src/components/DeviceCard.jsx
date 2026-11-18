import { AirVent, Fan, Lightbulb, PlugZap, Tv2 } from 'lucide-react';
import ToggleControl from './ToggleControl.jsx';
import { useToast } from '../state/ToastProvider.jsx';
import { useStoredState } from '../hooks/useStoredState.js';

const deviceIcons = {
  light: Lightbulb,
  fan: Fan,
  climate: AirVent,
  entertainment: Tv2,
  plug: PlugZap,
};

export default function DeviceCard({ device, onToggle, onSettingsChange, compact = false }) {
  const Icon = deviceIcons[device.category] || Lightbulb;
  const showToast = useToast();
  const [preferences] = useStoredState('homevoice.preferences.v1', { showDemoLabels: true, gentleTransitions: true });

  function toggle() {
    onToggle(device.id);
    showToast(`${device.name} turned ${device.isOn ? 'off' : 'on'} in the demo.`);
  }

  return (
    <article className={`device-card ${compact ? 'device-card-compact' : ''} ${device.isOn ? 'device-card-on' : ''}`}>
      <div className="device-card-top">
        <span className={`device-icon device-icon-${device.category} ${device.isOn ? 'device-icon-active' : ''}`}><Icon size={19} strokeWidth={1.8} /></span>
        <ToggleControl checked={device.isOn} onChange={toggle} label={`${device.isOn ? 'Turn off' : 'Turn on'} ${device.name}`} />
      </div>
      <div className="device-card-name"><h3>{device.name}</h3><p>{device.room}</p></div>
      <div className="device-card-state"><span className={`mini-status ${device.isOn ? 'on' : ''}`} />{device.isOn ? 'On' : 'Off'}{preferences.showDemoLabels && <><span className="state-divider">·</span><span>Demo</span></>}</div>

      {device.category === 'light' && (
        <div className="device-setting">
          <div className="setting-label"><span>Brightness</span><strong>{device.settings.brightness}%</strong></div>
          <input aria-label={`${device.name} brightness`} type="range" min="1" max="100" value={device.settings.brightness} onChange={(event) => onSettingsChange(device.id, { brightness: Number(event.target.value) })} disabled={!device.isOn} />
        </div>
      )}
      {device.category === 'climate' && (
        <div className="climate-setting">
          <span className="setting-label">Comfort setting</span>
          <div className="temperature-control">
            <button type="button" aria-label="Lower temperature" disabled={!device.isOn || device.settings.temperature <= 16} onClick={() => onSettingsChange(device.id, { temperature: device.settings.temperature - 1 })}>−</button>
            <strong>{device.settings.temperature}<sup>°</sup></strong>
            <button type="button" aria-label="Raise temperature" disabled={!device.isOn || device.settings.temperature >= 30} onClick={() => onSettingsChange(device.id, { temperature: device.settings.temperature + 1 })}>+</button>
          </div>
        </div>
      )}
      {device.category === 'fan' && (
        <div className="device-setting setting-inline">
          <label className="setting-label" htmlFor={`${device.id}-speed`}>Fan speed</label>
          <select id={`${device.id}-speed`} value={device.settings.speed} disabled={!device.isOn} onChange={(event) => onSettingsChange(device.id, { speed: event.target.value })}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </div>
      )}
      {device.category === 'plug' && <div className="device-extra">{device.isOn ? `${device.settings.powerWatts} W · ${device.settings.appliance}` : `${device.settings.appliance} · paused`}</div>}
      {device.category === 'entertainment' && <div className="device-extra">{device.isOn ? `Ready · ${device.settings.input}` : 'Standby · Living Room'}</div>}
    </article>
  );
}
