import { AlertCircle } from 'lucide-react';
import { cn } from '../utils';

interface PassDetailsProps {
  className?: string;
  formUrl?: string;
}

export function PassDetails({
  className,
  formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfD7Pz9c6f2aOaQz_1uRdf4uH26i3c7X-N2kP9oW_K4v-Q4YQ/viewform?embedded=true",
}: PassDetailsProps) {
  const laserAnimationStyle = `
    @keyframes laserSweep {
      0%, 100% { top: 0%; opacity: 0.2; }
      50% { top: 100%; opacity: 1; }
    }
  `;

  return (
    <div className={cn("w-full font-mono relative z-10", className)}>
      <style dangerouslySetInnerHTML={{ __html: laserAnimationStyle }} />

      {/* ─── QR Payment Card ─── */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-white/10 rounded-[24px] p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6 mb-8 shadow-xl shadow-cyan-500/5">
        {/* QR Code */}
        <div className="shrink-0 p-3 bg-zinc-900/80 border border-white/10 rounded-2xl relative group overflow-hidden">
          {/* Laser Sweep */}
          <div 
            className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee] pointer-events-none z-20"
            style={{ animation: 'laserSweep 3.5s infinite ease-in-out' }}
          />
          {/* Corner Targets */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-400" />

          <svg width="120" height="120" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400/90 group-hover:text-cyan-300 transition-colors duration-300">
            <rect x="10" y="10" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path d="M20 20H40V40H20V20Z" fill="currentColor"/>
            <rect x="130" y="10" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path d="M140 20H160V40H140V20Z" fill="currentColor"/>
            <rect x="10" y="130" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path d="M20 140H40V160H20V140Z" fill="currentColor"/>
            <rect x="60" y="20" width="8" height="8" fill="currentColor"/>
            <rect x="80" y="20" width="8" height="8" fill="currentColor"/>
            <rect x="100" y="20" width="8" height="8" fill="currentColor"/>
            <rect x="60" y="40" width="8" height="8" fill="currentColor"/>
            <rect x="90" y="40" width="8" height="8" fill="currentColor"/>
            <rect x="110" y="40" width="8" height="8" fill="currentColor"/>
            <rect x="20" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="40" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="60" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="80" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="100" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="120" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="140" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="160" y="60" width="8" height="8" fill="currentColor"/>
            <rect x="60" y="80" width="16" height="8" fill="currentColor"/>
            <rect x="90" y="80" width="8" height="16" fill="currentColor"/>
            <rect x="110" y="80" width="16" height="8" fill="currentColor"/>
            <rect x="140" y="80" width="8" height="8" fill="currentColor"/>
            <rect x="80" y="100" width="8" height="8" fill="currentColor"/>
            <rect x="100" y="100" width="16" height="16" fill="currentColor"/>
            <rect x="130" y="100" width="8" height="8" fill="currentColor"/>
            <rect x="150" y="100" width="16" height="8" fill="currentColor"/>
            <rect x="60" y="120" width="8" height="8" fill="currentColor"/>
            <rect x="80" y="120" width="16" height="8" fill="currentColor"/>
            <rect x="120" y="120" width="8" height="16" fill="currentColor"/>
            <rect x="140" y="120" width="8" height="8" fill="currentColor"/>
            <rect x="60" y="140" width="16" height="16" fill="currentColor"/>
            <rect x="90" y="140" width="8" height="8" fill="currentColor"/>
            <rect x="110" y="140" width="16" height="8" fill="currentColor"/>
            <rect x="150" y="140" width="8" height="16" fill="currentColor"/>
            <rect x="90" y="160" width="16" height="8" fill="currentColor"/>
            <rect x="120" y="160" width="8" height="8" fill="currentColor"/>
            <rect x="130" y="160" width="16" height="8" fill="currentColor"/>
          </svg>
        </div>

        {/* QR Payment Details */}
        <div className="text-center sm:text-left space-y-2 flex-1">
          <p className="text-cyan-400 text-lg font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
            Pay to this QR
          </p>
          <p className="text-white/40 text-xs font-sans leading-relaxed max-w-[300px]">
            Scan using any UPI app (GPay, PhonePe, Paytm) to complete your payment. After payment, fill the form below.
          </p>
        </div>
      </div>

      {/* ─── Registration Form Card ─── */}
      <div className="bg-zinc-950/60 backdrop-blur-md border border-white/10 rounded-[24px] p-6 md:p-8 shadow-xl shadow-cyan-500/5">
        <div className="space-y-1 mb-6">
          <span className="text-cyan-400 text-sm uppercase tracking-widest font-bold block">
            Step 2 of Registration
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase">
            Details Registration
          </h2>
        </div>

        {/* Google Form Embed */}
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-black/40 relative" style={{ height: '900px' }}>
          {/* Loading fallback behind iframe */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none text-center p-6">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-widest text-cyan-500/60">
              Connecting to Google Forms...
            </span>
            <p className="text-[11px] text-white/30 max-w-[280px] leading-relaxed mt-1 font-sans">
              If the form is not visible due to school sign-in requirements, click below:
            </p>
            <a 
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2.5 rounded-xl font-mono font-bold uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 cursor-pointer mt-2"
            >
              Open Registration Form
            </a>
          </div>
          
          <iframe
            src={formUrl}
            className="w-full h-full border-0 relative z-10 rounded-2xl"
            title="Pass Details Form"
            loading="lazy"
          >
            Loading registration form...
          </iframe>
        </div>
        
        {/* Footer Note */}
        <div className="flex items-center gap-2.5 text-white/40 text-[10px] mt-5 font-sans">
          <AlertCircle className="w-3.5 h-3.5 text-cyan-400/80 shrink-0" />
          <span>Ensure all details match your official ID. Pass will be locked to verified students.</span>
        </div>
      </div>
    </div>
  );
}

export default PassDetails;
