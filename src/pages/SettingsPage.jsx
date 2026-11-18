import { useState } from 'react';
import { ArrowRight, RotateCcw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import ToggleControl from '../components/ToggleControl.jsx';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { useStoredState } from '../hooks/useStoredState.js';
import { useDevices } from '../state/DeviceProvider.jsx';
import { useToast } from '../state/ToastProvider.jsx';

const defaultPreferences = { showDemoLabels: true, gentleTransitions: true };

export default function SettingsPage() {
  const [preferences, setPreferences] = useStoredState('homevoice.preferences.v1', defaultPreferences);
  const { devices, resetDemo } = useDevices();
  const showToast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  function updatePreference(key, value) {
    setPreferences((current) => ({ ...current, [key]: value }));
    showToast('Preference saved in this browser.');
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    resetDemo();
    setConfirmReset(false);
    showToast('Sample device states restored.');
  }

  return (
    <div className="settings-page">
      <PageHeading eyebrow="THE DETAILS THAT MAKE IT YOURS" title="Settings" description="A few local preferences for this HomeVoice demo." action={<StatusIndicator tone="neutral">This browser</StatusIndicator>} />
      <section className="settings-section-card"><div className="settings-section-heading"><span className="settings-heading-icon"><SlidersHorizontal size={17} /></span><div><h2>Display preferences</h2><p>Saved only in this browser; no account or cloud profile is connected.</p></div></div><div className="settings-preference-row"><div><strong>Show demo labels on controls</strong><span>Keep the simulated status visible beside each device.</span></div><ToggleControl checked={preferences.showDemoLabels} onChange={(value) => updatePreference('showDemoLabels', value)} label="Show demo labels on controls" /></div><div className="settings-preference-row"><div><strong>Gentle transitions</strong><span>Use soft motion on interactive cards and panels.</span></div><ToggleControl checked={preferences.gentleTransitions} onChange={(value) => updatePreference('gentleTransitions', value)} label="Gentle transitions" /></div></section>
      <section className="settings-section-card"><div className="settings-section-heading"><span className="settings-heading-icon settings-shield"><ShieldCheck size={17} /></span><div><h2>Privacy & connections</h2><p>What this foundation does—and does not—connect to.</p></div></div><div className="connection-status-row"><div><strong>Home Assistant</strong><span>No server, access token, or hardware is connected.</span></div><StatusIndicator tone="neutral">Not connected</StatusIndicator></div><div className="connection-status-row"><div><strong>Voice transcription</strong><span>Whisper integration is reserved for a future phase.</span></div><StatusIndicator tone="neutral">Not connected</StatusIndicator></div></section>
      <section className="settings-section-card reset-settings-card"><div className="settings-section-heading"><span className="settings-heading-icon"><RotateCcw size={17} /></span><div><h2>Sample devices</h2><p>Restore the original six simulated devices and sample activity. Current device status: {devices.filter((device) => device.isOn).length} on.</p></div></div><div className="reset-actions"><button className={confirmReset ? 'danger-button' : 'secondary-button'} type="button" onClick={handleReset}>{confirmReset ? 'Confirm restore sample data' : 'Restore sample state'} <ArrowRight size={14} /></button>{confirmReset && <button className="quiet-button" type="button" onClick={() => setConfirmReset(false)}>Cancel</button>}</div></section>
      <p className="settings-note">No credentials are stored or requested by this demo. All device actions are simulated and stay in local browser storage.</p>
    </div>
  );
}
