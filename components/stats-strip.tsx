import { Ship, Users, Globe, MapPin } from "lucide-react";

const stats = [
  { icon: Ship, value: "6+", line1: "cruise lines", line2: "yolanda's sailed" },
  { icon: Globe, value: "15+", line1: "countries", line2: "and counting" },
  { icon: Users, value: "17.2k+", line1: "travelholics", line2: "in the crew" },
  { icon: MapPin, value: "4+", line1: "group trips", line2: "on the books" },
];

export const StatsStrip = () => {
  return (
    <section className="relative overflow-hidden bg-cream py-6 sm:py-8 md:py-10">
      <div className="mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-14 xl:px-20">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-0 md:divide-x md:divide-stone/20">
          {stats.map(({ icon: Icon, value, line1, line2 }) => (
            <div
              key={`${value}-${line1}`}
              className="flex min-h-[124px] items-center gap-3 rounded-2xl border border-stone/10 bg-white/65 px-3.5 py-3 shadow-[0_6px_16px_rgba(26,58,82,0.06)] backdrop-blur-[1px] sm:min-h-[132px] sm:gap-3.5 sm:px-4 sm:py-3.5 md:min-h-0 md:justify-center md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:px-6 md:py-3 md:shadow-none md:backdrop-blur-0"
            >
              <Icon className="shrink-0 text-coral" size={32} strokeWidth={2} />
              <div className="flex flex-col items-start gap-1">
                <span className="font-serif text-[1.95rem] font-medium leading-none text-navy sm:text-[2rem]">{value}</span>
                <span className="text-[11px] font-semibold leading-[1.1] tracking-[0.06em] text-stone/90">{line1}</span>
                <span className="text-[11px] font-semibold leading-[1.1] tracking-[0.06em] text-stone/90">{line2}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
