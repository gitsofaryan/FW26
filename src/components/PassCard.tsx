import { Check, Plus, ExternalLink, AlertCircle } from 'lucide-react';
import { cn } from '../utils';

interface PassCardProps {
  className?: string;
  formUrl?: string;
}

const features = [
  { label: 'Full Gallery Access', included: true },
  { label: 'Event Entry Ticket', included: true },
  { label: 'High-Res Downloads', included: true },
  { label: 'Exclusive Afterparty', included: true },
  { label: 'VIP Seating Add-on', isAddOn: true },
];

export function PassCard({
  className,
  formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeserd7A5CwQ9j6kn6DlHYxh2-QLRq6TME760itTc_NocNs5Q/viewform",
}: PassCardProps) {
  const laserStyle = `
    @keyframes laserSweep {
      0%, 100% { top: 0%; opacity: 0.15; }
      50% { top: 100%; opacity: 0.8; }
    }
  `;

  return (
    <div className={cn("w-full font-mono relative z-20 py-16 md:py-24 pb-32 bg-black/35 backdrop-blur-[2px] min-h-screen lg:min-h-0 flex items-center justify-center border-t border-white/10", className)}>
      <style dangerouslySetInnerHTML={{ __html: laserStyle }} />

      {/* Dotted background pattern spanning edge-to-edge */}
      <div
        className="absolute inset-0 z-0 opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      {/* Dots on top */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '18px 18px',
        }}
      />
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-purple-500/[0.02]" />

      {/* Content Container (Centered & bounded wide content inside the section) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">

        {/* ═══ LEFT SIDE — Pricing & Pass Details ═══ */}
        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06]">

          {/* Header */}
          <div className="space-y-6 mb-10">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-bold block">
                Farewell 2026
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white uppercase tracking-tight leading-[1.1]">
                Event<br />Pass
              </h2>
            </div>
            <p className="text-white/40 text-sm font-sans leading-relaxed max-w-sm">
              Secure your spot at the event. Transparent pricing, no hidden fees.
            </p>
          </div>

          {/* Price block */}
          <div className="mb-10">
            <div className="flex items-baseline gap-3">
              <span className="text-5xl md:text-6xl font-black text-white tracking-tight">₹1500</span>
              <span className="text-white/30 text-sm font-bold uppercase tracking-widest">/ pass</span>
            </div>
            <span className="text-cyan-400/80 text-xs uppercase tracking-widest font-bold mt-2 block">
              Standard Entry
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] w-full mb-8" />

          {/* Features list */}
          <div className="space-y-5 mb-10">
            <h3 className="text-white/50 font-bold uppercase tracking-[0.2em] text-[10px]">
              What's included
            </h3>
            <ul className="space-y-3.5">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                    {feature.isAddOn ? (
                      <Plus className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                    ) : (
                      <Check className="w-3 h-3 text-cyan-400" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-white/60 text-sm font-medium font-sans">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom decorative line */}
          <div className="flex items-center gap-3 text-white/15 text-[9px] font-mono mt-auto pt-6 border-t border-white/[0.04]">
            <span>PASS_ID: FW26-STD</span>
            <span>•</span>
            <span>SECTOR: 5-ALPHA</span>
            <span>•</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>

        {/* ═══ RIGHT SIDE — QR Code & Form Link ═══ */}
        <div className="flex-1 p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center gap-8">

          {/* QR Code Container */}
          <div className="relative group">
            {/* Glow ring */}
            <div className="absolute -inset-3 bg-cyan-500/[0.06] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative p-4 bg-black/60 border border-white/[0.08] rounded-2xl overflow-hidden">
              {/* Laser sweep */}
              <div
                className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_12px_#22d3ee,0_0_4px_#22d3ee] pointer-events-none z-20"
                style={{ animation: 'laserSweep 3.5s infinite ease-in-out' }}
              />
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60" />
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60" />

              <svg width="160" height="160" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400/80 group-hover:text-cyan-300 transition-colors duration-500">
                <rect x="10" y="10" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M20 20H40V40H20V20Z" fill="currentColor" />
                <rect x="130" y="10" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M140 20H160V40H140V20Z" fill="currentColor" />
                <rect x="10" y="130" width="40" height="40" stroke="currentColor" strokeWidth="4" fill="none" />
                <path d="M20 140H40V160H20V140Z" fill="currentColor" />
                <rect x="60" y="20" width="8" height="8" fill="currentColor" />
                <rect x="80" y="20" width="8" height="8" fill="currentColor" />
                <rect x="100" y="20" width="8" height="8" fill="currentColor" />
                <rect x="60" y="40" width="8" height="8" fill="currentColor" />
                <rect x="90" y="40" width="8" height="8" fill="currentColor" />
                <rect x="110" y="40" width="8" height="8" fill="currentColor" />
                <rect x="20" y="60" width="8" height="8" fill="currentColor" />
                <rect x="40" y="60" width="8" height="8" fill="currentColor" />
                <rect x="60" y="60" width="8" height="8" fill="currentColor" />
                <rect x="80" y="60" width="8" height="8" fill="currentColor" />
                <rect x="100" y="60" width="8" height="8" fill="currentColor" />
                <rect x="120" y="60" width="8" height="8" fill="currentColor" />
                <rect x="140" y="60" width="8" height="8" fill="currentColor" />
                <rect x="160" y="60" width="8" height="8" fill="currentColor" />
                <rect x="60" y="80" width="16" height="8" fill="currentColor" />
                <rect x="90" y="80" width="8" height="16" fill="currentColor" />
                <rect x="110" y="80" width="16" height="8" fill="currentColor" />
                <rect x="140" y="80" width="8" height="8" fill="currentColor" />
                <rect x="80" y="100" width="8" height="8" fill="currentColor" />
                <rect x="100" y="100" width="16" height="16" fill="currentColor" />
                <rect x="130" y="100" width="8" height="8" fill="currentColor" />
                <rect x="150" y="100" width="16" height="8" fill="currentColor" />
                <rect x="60" y="120" width="8" height="8" fill="currentColor" />
                <rect x="80" y="120" width="16" height="8" fill="currentColor" />
                <rect x="120" y="120" width="8" height="16" fill="currentColor" />
                <rect x="140" y="120" width="8" height="8" fill="currentColor" />
                <rect x="60" y="140" width="16" height="16" fill="currentColor" />
                <rect x="90" y="140" width="8" height="8" fill="currentColor" />
                <rect x="110" y="140" width="16" height="8" fill="currentColor" />
                <rect x="150" y="140" width="8" height="16" fill="currentColor" />
                <rect x="90" y="160" width="16" height="8" fill="currentColor" />
                <rect x="120" y="160" width="8" height="8" fill="currentColor" />
                <rect x="130" y="160" width="16" height="8" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* Payment instruction */}
          <div className="text-center space-y-3">
            <p className="text-white text-base font-black uppercase tracking-[0.15em]">
              Pay to this QR
            </p>
            <p className="text-white/35 text-[11px] font-sans leading-relaxed max-w-[260px] mx-auto">
              Scan using any UPI app (GPay, PhonePe, Paytm). After payment, fill the registration form.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Form link button */}
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn w-full flex items-center justify-center gap-2.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/15 px-6 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer"
          >
            <span className="text-white/80 group-hover/btn:text-white text-xs font-bold uppercase tracking-widest transition-colors">
              Open Registration Form
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-white/40 group-hover/btn:text-cyan-400 transition-colors" />
          </a>

          {/* Micro note */}
          <div className="flex items-center gap-2 text-white/25 text-[9px] font-sans">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Details must match your official ID</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PassCard;
