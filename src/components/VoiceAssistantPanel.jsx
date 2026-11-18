import { ArrowUpRight, AudioLines, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function VoiceAssistantPanel() {
  return (
    <section className="voice-panel">
      <div className="voice-panel-top"><span className="voice-icon"><AudioLines size={19} /></span><span className="voice-sparkle"><Sparkles size={14} /></span></div>
      <p className="eyebrow voice-eyebrow">A HANDS-FREE MOMENT</p>
      <h3>Let your home<br />take a hint.</h3>
      <p className="voice-copy">Try a typed command with your simulated devices. Microphone and hardware control are not connected.</p>
      <Link className="voice-link" to="/voice">Explore voice desk <ArrowUpRight size={15} /></Link>
      <div className="voice-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div>
    </section>
  );
}
