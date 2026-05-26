import { Ship, Users, Globe, MapPin } from "lucide-react";

const stats = [
  { icon: Ship, value: "6+", line1: "cruise lines", line2: "yolanda's sailed" },
  { icon: Globe, value: "15+", line1: "countries", line2: "and counting" },
  { icon: Users, value: "17.2k+", line1: "travelholics", line2: "in the crew" },
  { icon: MapPin, value: "4+", line1: "group trips", line2: "on the books" },
];

export const StatsStrip = () => {
  return (
    <section className="bg-cream py-10 relative overflow-hidden">
      <div className="max-w-[92rem] w-full mx-auto px-8 lg:px-14 xl:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-stone/20">
          {stats.map(({ icon: Icon, value, line1, line2 }) => (
            <div key={`${value}-${line1}`} className="flex items-center justify-center gap-4 px-6 py-3">
              <Icon className="text-coral shrink-0" size={56} strokeWidth={1.9} />
              <div className="flex flex-col items-start gap-1">
                <span className="font-serif text-[2rem] font-medium text-navy leading-none">{value}</span>
                <span className="text-[11px] font-medium tracking-[0.11em] text-stone/90 leading-none lowercase">{line1}</span>
                <span className="text-[11px] font-medium tracking-[0.11em] text-stone/90 leading-none lowercase">{line2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
