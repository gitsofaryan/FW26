import { Check, Plus } from 'lucide-react';
import { cn } from '../utils';

interface PricingFeature {
  label: string;
  included: boolean;
  isAddOn?: boolean;
}

interface PricingSectionProps {
  className?: string;
  heading?: string;
  subheading?: string;
  price?: string;
  feeLabel?: string;
  features?: PricingFeature[];
}

const defaultFeatures: PricingFeature[] = [
  { label: 'Full Gallery Access', included: true },
  { label: 'Event Entry Ticket', included: true },
  { label: 'High-Res Downloads', included: true },
  { label: 'Exclusive Afterparty', included: true },
  { label: 'VIP Seating Add-on', included: true, isAddOn: true },
];

export function PricingSection({
  className,
  heading = "Farewell 2026 Passes",
  subheading = "Secure your spot at the event. Transparent pricing, no hidden fees.",
  price = "₹1500",
  feeLabel = "Standard Entry Pass",
  features = defaultFeatures,
}: PricingSectionProps) {
  return (
    <div className={cn("w-full max-w-[1200px] mx-auto p-4 md:p-6 font-mono pt-20 md:pt-32 relative z-10", className)}>
      <div className="flex flex-col lg:flex-row bg-transparent border border-white/10 rounded-[32px] overflow-hidden min-h-[500px] shadow-2xl shadow-cyan-500/10">
        
        {/* Left Section - Hero & CTA */}
        <div className="flex-1 p-8 md:p-12 lg:p-16 flex flex-col justify-between relative">
          {/* Subtle cyan glow in background */}
          <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 blur-[100px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <h2 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-bold tracking-tight text-white uppercase">
              {heading}
            </h2>
            <p className="text-lg md:text-xl text-white/60 font-normal max-w-md">
              {subheading}
            </p>
          </div>
        </div>

        {/* Right Section - Pricing Details */}
        <div className="flex-1 lg:max-w-[480px] lg:border-l border-white/10 p-8 md:p-12 lg:p-16 flex flex-col bg-black/35 backdrop-blur-md">
          <div className="space-y-2">
            <span className="text-cyan-400 text-sm uppercase tracking-widest font-bold block">
              {feeLabel}
            </span>
            <div className="text-5xl md:text-6xl font-black tracking-tight text-white">
              {price}
            </div>
          </div>

          <div className="h-px bg-white/10 w-full my-10" />

          <div className="space-y-6">
            <h3 className="text-white/80 font-bold uppercase tracking-widest text-sm">Pass Includes</h3>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0">
                    {feature.isAddOn ? (
                      <Plus className="w-5 h-5 text-cyan-400" strokeWidth={3} />
                    ) : (
                      <Check className="w-5 h-5 text-cyan-400" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-white/70 text-base font-medium leading-relaxed">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingSection;
