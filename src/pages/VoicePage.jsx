import { useState } from 'react';
import { ArrowUpRight, AudioLines, CircleHelp, MicOff, Send, Sparkles } from 'lucide-react';
import { PageHeading, StatusIndicator } from '../components/StatusIndicator.jsx';
import { useDevices } from '../state/DeviceProvider.jsx';
import { useToast } from '../state/ToastProvider.jsx';
import { parseSimulatedCommand } from '../utils/commandParser.js';

const examples = ['Turn off the living room light', 'Turn on Bedroom Fan', 'Set Living Room AC temperature to 21'];

export default function VoicePage() {
  const { devices, setDevicesPower, updateDeviceSettings } = useDevices();
  const showToast = useToast();
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState(null);

  function submitCommand(event) {
    event.preventDefault();
    const result = parseSimulatedCommand(command, devices);
    if (result.type === 'power') {
      setDevicesPower(result.deviceIds, result.isOn);
    } else if (result.type === 'setting') {
      result.deviceIds.forEach((id) => updateDeviceSettings(id, { [result.setting]: result.value }));
    }
    setResponse({ ...result, submitted: command });
    if (result.type !== 'unknown') showToast(result.message);
    setCommand('');
  }

  return (
    <div className="voice-page">
      <PageHeading eyebrow="A MORE NATURAL WAY TO ASK" title="Voice assistant" description="Try a typed phrase against the local demo. No audio is recorded and no hardware is controlled." action={<StatusIndicator tone="neutral">Text simulation</StatusIndicator>} />
      <div className="voice-workspace">
        <section className="voice-console-card">
          <div className="voice-console-header"><span className="voice-console-icon"><AudioLines size={21} /></span><span className="voice-console-status"><span /> READY TO TRY</span></div>
          <div className="voice-console-center"><div className="voice-orb"><AudioLines size={30} strokeWidth={1.5} /></div><p className="eyebrow">LOCAL COMMAND PREVIEW</p><h2>What would you<br />like the demo to do?</h2><p>Type a device name and a simple action. For example, ask to switch a light or adjust the simulated room temperature.</p></div>
          <form className="voice-command-form" onSubmit={submitCommand}>
            <label className="sr-only" htmlFor="voice-command">Type a simulated device command</label>
            <input id="voice-command" value={command} onChange={(event) => setCommand(event.target.value)} placeholder="Try: Turn off the living room light" />
            <button type="submit" disabled={!command.trim()} aria-label="Run simulated command"><Send size={17} /></button>
          </form>
          <div className="voice-command-disclaimer"><MicOff size={15} /><span>Microphone input is not connected. This is a text-only simulation.</span></div>
          {response && <div className={`voice-response ${response.type === 'unknown' ? 'voice-response-soft' : ''}`} role="status"><span>{response.type === 'unknown' ? <CircleHelp size={16} /> : <Sparkles size={16} />}</span><div><strong>{response.type === 'unknown' ? 'One more try?' : 'Done in the demo'}</strong><p>{response.message}</p></div></div>}
        </section>

        <aside className="voice-side-column">
          <section className="voice-examples-card"><p className="eyebrow">A FEW THINGS TO TRY</p><h3>Simple words<br />are just fine.</h3><div className="voice-example-list">{examples.map((example) => <button key={example} type="button" onClick={() => { setCommand(example); setResponse(null); }}><span>“{example}”</span><ArrowUpRight size={15} /></button>)}</div></section>
          <section className="voice-readiness-card"><div className="readiness-header"><span><Sparkles size={16} /></span><p className="eyebrow">READY FOR WHAT'S NEXT</p></div><div className="readiness-item"><span className="readiness-check">✓</span><span><strong>Shared device state</strong><small>Already powers every page</small></span><StatusIndicator tone="sage" dot={false}>Ready</StatusIndicator></div><div className="readiness-item"><span className="readiness-pending">○</span><span><strong>Whisper transcription</strong><small>Not connected in this phase</small></span><StatusIndicator tone="neutral" dot={false}>Later</StatusIndicator></div></section>
        </aside>
      </div>
    </div>
  );
}
