import { Ship, Users, Anchor, Tag } from "lucide-react";

const PostageStamp = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 80 100"
    className={className}
    aria-hidden="true"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="74" height="94" rx="2" stroke="#10755A" strokeWidth="1.5" strokeDasharray="5 3" fill="#FCFAF5" />
    <rect x="10" y="10" width="60" height="62" rx="2" fill="#F4C4CC" />
    <text x="40" y="50" textAnchor="middle" fontSize="30" fill="#0d4a3a">✈</text>
    <text x="40" y="84" textAnchor="middle" fontSize="7" fill="#10755A" fontFamily="monospace" fontWeight="bold" letterSpacing="1">TRAVELHOLIC</text>
  </svg>
);

const stats = [
  { icon: Ship,   value: "20",   label: "Years at Sea"     },
  { icon: Users,  value: "500+", label: "Happy Travelers"  },
  { icon: Anchor, value: "6",    label: "Cruise Lines"     },
  { icon: Tag,    value: "No",   label: "Booking Fees"     },
];

export const StatsStrip = () => {
  return (
    <section className="bg-sand py-10 relative overflow-hidden">
      <PostageStamp className="absolute left-3 top-1/2 -translate-y-1/2 w-14 h-[70px] opacity-35" />
      <PostageStamp className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-[70px] opacity-35 scale-x-[-1]" />

      <div className="max-w-4xl mx-auto px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-blush">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 px-6 py-3">
              <Icon className="text-emerald-mid" size={24} />
              <span className="text-3xl font-extrabold text-ink leading-none">{value}</span>
              <span className="text-sm text-stone text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
