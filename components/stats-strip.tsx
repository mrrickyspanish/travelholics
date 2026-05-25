import { Ship, Users, Anchor, Tag } from "lucide-react";

// Sepia/aged postage-stamp decoration
const PostageStamp = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 100"
    className={className}
    aria-hidden="true"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="74" height="94" rx="2" stroke="#6B7B74" strokeWidth="1.5" strokeDasharray="5 3" fill="#FCFAF5" />
    <rect x="10" y="10" width="60" height="62" rx="2" fill="#F4C4CC" opacity="0.6" />
    <text x="40" y="50" textAnchor="middle" fontSize="28" fill="#0d4a3a" opacity="0.5">✈</text>
    <text x="40" y="82" textAnchor="middle" fontSize="7" fill="#6B7B74" fontFamily="monospace" fontWeight="bold" letterSpacing="1">TRAVELHOLIC</text>
    {/* Cancellation lines */}
    <line x1="12" y1="20" x2="68" y2="20" stroke="#6B7B74" strokeWidth="0.8" opacity="0.3" />
    <line x1="12" y1="24" x2="68" y2="24" stroke="#6B7B74" strokeWidth="0.8" opacity="0.3" />
  </svg>
);

const stats = [
  { icon: Ship,   value: "20",   label: "Years at Sea"    },
  { icon: Users,  value: "500+", label: "Happy Travelers" },
  { icon: Anchor, value: "6",    label: "Cruise Lines"    },
  { icon: Tag,    value: "No",   label: "Booking Fees"    },
];

export const StatsStrip = () => {
  return (
    <section className="bg-sand py-10 relative overflow-hidden">
      <PostageStamp className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-[70px] opacity-55" />
      <PostageStamp className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-[70px] opacity-55 scale-x-[-1]" />

      <div className="max-w-4xl mx-auto px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone/20">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6 py-3">
              {/* Navy-teal icon, restrained size */}
              <Icon className="text-emerald-deep/70" size={20} strokeWidth={1.8} />
              {/* Serif number for editorial weight */}
              <span className="font-serif text-[2rem] font-semibold text-ink leading-none mt-0.5">{value}</span>
              <span className="text-xs text-stone text-center mt-0.5">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
