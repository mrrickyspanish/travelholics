import { Ship, Users, Globe, MapPin } from "lucide-react";

const stats = [
  { icon: Ship, value: "6+", label: "cruise lines sailed" },
  { icon: Globe, value: "15+", label: "countries visited" },
  { icon: Users, value: "17.2k+", label: "crew members strong" },
  { icon: MapPin, value: "4+", label: "group trips booked" },
];

export const StatsStrip = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-6 sm:py-8 md:py-10">
      <div className="mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-14 xl:px-20">
        <div className="grid grid-cols-2 items-stretch gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone/20">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={value}
              className="flex h-full flex-col items-start gap-2 rounded-2xl border border-stone/10 bg-white/65 px-4 py-4 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px] sm:px-5 sm:py-5 md:rounded-none md:border-0 md:bg-transparent md:px-6 md:py-3 md:shadow-none md:backdrop-blur-0"
            >
              <Icon className="shrink-0 text-coral" size={20} strokeWidth={2} />
              <span className="font-serif text-[2rem] font-semibold leading-none text-navy sm:text-[2.25rem] md:text-[2.5rem]">{value}</span>
              <span className="text-[15px] leading-snug text-stone/90">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
