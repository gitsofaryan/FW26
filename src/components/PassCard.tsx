import { ExternalLink } from 'lucide-react';
import { cn } from '../utils';

interface PassCardProps {
  className?: string;
  formUrl?: string;
}

const features = [
  { label: '🍽️ Food & Venue', cost: '₹800' },
  { label: '🎧 DJ & Dance Floor', cost: '₹80' },
  { label: '📸 Photography', cost: '₹50' },
  { label: '🎊 Decoration', cost: '₹30' },
  { label: '🛡️ Security Arrangements', cost: '₹20' },
  { label: '🎁 Gifts & Fun Activities', cost: '₹20' },
  { label: '😂 Unlimited Bakchodi & Vibes', cost: 'Priceless' }
];

export function PassCard({
  className,
  formUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeserd7A5CwQ9j6kn6DlHYxh2-QLRq6TME760itTc_NocNs5Q/viewform",
}: PassCardProps) {
  return (
    <div className={cn("w-full font-mono relative z-20 py-2 sm:py-4 bg-transparent flex items-center justify-center border-none", className)}>

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

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[95vw] sm:max-w-[1150px] mx-auto px-3 sm:px-6 md:px-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-stretch">

        {/* ═══ LEFT SIDE — Pricing & Pass Details ═══ */}
        <div className="flex-1 p-3 sm:p-4 md:p-4 lg:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/[0.06] space-y-2">

          {/* Header */}
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-[0.15em] text-cyan-400 font-black block">
              विदाई समारोह • FAREWELL 2026
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-none">
              Event<br />Pass
            </h2>
          </div>

          {/* Venue & Booking Notice Bulletin */}
          <div className="p-2 sm:p-2.5 bg-cyan-950/20 border border-cyan-500/25 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black block">
                📍 Finalized Venue
              </span>
              <span className="text-rose-400 text-[9px] font-black tracking-widest block uppercase">
                ⏰ Deadline: 5 June
              </span>
            </div>

            {/* Venue Image Card */}
            <div className="relative w-full h-20 sm:h-24 rounded-xl overflow-hidden border border-white/10 group/venue">
              <img 
                src="/shawn_elizy.jpg" 
                alt="Shawn Elizy Hotel Venue" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/venue:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-2 left-2.5">
                <p className="text-white font-black text-xs uppercase tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Shawn Elizy 🎩✨
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-black uppercase text-white/80 font-sans">
              <div className="p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl flex flex-col justify-center">
                <span className="text-white/40 text-[7px] tracking-wider mb-0.5">DATE</span>
                <span>14 June 2026</span>
              </div>
              <div className="p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl flex flex-col justify-center">
                <span className="text-white/40 text-[7px] tracking-wider mb-0.5">TIME</span>
                <span>12:00 PM onwards</span>
              </div>
            </div>
          </div>

          {/* Price block */}
          <div className="space-y-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-none">₹1000</span>
              <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">/ pass</span>
            </div>
            <span className="text-cyan-400 text-[9px] uppercase tracking-widest font-black block">
              Super Stallion
            </span>
          </div>

          {/* Divider */}
          <div className="h-px bg-white/[0.06] w-full" />

          {/* Cost Breakdown */}
          <div className="space-y-1">
            <h3 className="text-white font-black uppercase tracking-[0.15em] text-[9px]">
              📊 TRANSPARENT COST BREAKDOWN
            </h3>
            <ul className="space-y-1">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center justify-between border-b border-white/[0.03] pb-1 text-[11px] font-sans font-bold text-white/95">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[9px] text-cyan-400">✔</span> {feature.label}
                  </span>
                  <span className="font-mono text-cyan-400 text-[11px]">{feature.cost}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ═══ RIGHT SIDE — QR Code & Form Link ═══ */}
        <div className="flex-1 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center justify-center gap-3">

          {/* QR Code Container */}
          <div className="relative group">
            {/* Glow ring */}
            <div className="absolute -inset-3 bg-cyan-500/[0.06] rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative p-2.5 bg-black/60 border border-white/[0.08] rounded-xl flex flex-col items-center justify-center">
              <img 
                src="/payment_qr.jpg" 
                alt="Rishabh Agrawal UPI QR Code" 
                loading="lazy" 
                className="w-[125px] h-[165px] sm:w-[150px] sm:h-[200px] object-contain rounded-lg relative z-10"
              />
            </div>
          </div>

          {/* Payment instruction */}
          <div className="w-full text-center space-y-1.5">
            <p className="text-white text-xs sm:text-sm font-black uppercase tracking-[0.15em] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Scan to Pay (₹1000)
            </p>
            <div className="bg-white/[0.03] border border-white/[0.08] px-2.5 py-1.5 rounded-xl text-center space-y-1 w-full">
              <div>
                <p className="text-white/40 text-[7.5px] uppercase tracking-widest font-mono">Primary UPI ID</p>
                <p className="text-cyan-400 text-[11px] font-mono font-bold select-all cursor-pointer leading-tight" title="Double click to copy">
                  agrawalrishabh546@okicici
                </p>
              </div>
              <div className="border-t border-white/5 pt-1">
                <p className="text-white/40 text-[7.5px] uppercase tracking-widest font-mono">Alternate UPI ID</p>
                <p className="text-cyan-400 text-[11px] font-mono font-bold select-all cursor-pointer leading-tight" title="Double click to copy">
                  917923031@ybl
                </p>
              </div>
            </div>
            <p className="text-white/60 text-[9.5px] font-bold font-sans leading-relaxed max-w-[220px] mx-auto">
              Pay ₹1000 using GPay, PhonePe, Paytm or any UPI app, then fill the form below.
            </p>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Form link button */}
          <a
            href={formUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 border border-cyan-400/25 px-4 py-2.5 rounded-xl transition-all duration-300 cursor-pointer shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="text-black text-xs font-black uppercase tracking-widest transition-colors">
              Open Registration Form
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-black/80 group-hover/btn:text-black transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}
