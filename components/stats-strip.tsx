import { BadgeDollarSign, Globe, Ship, Sparkles } from "lucide-react";

const stats = [
  {
    icon: Ship,
    value: "6+",
    label: "Cruise lines sailed",
    note: "Real ship experience, not brochure guesses",
  },
  {
    icon: Globe,
    value: "15+",
    label: "Countries visited",
    note: "Ports, resorts, excursions, and local finds",
  },
  {
    icon: Sparkles,
    value: "20+",
    label: "Years of travel experience",
    note: "A planner who's actually been there",
  },
  {
    icon: BadgeDollarSign,
    value: "No Fees",
    label: "Same price as booking direct",
    note: "You get guidance without the markup",
  },
];

export const StatsStrip = () => {
  return (
    <section className="relative overflow-hidden bg-sand py-8 sm:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[92rem] px-5 sm:px-6 lg:px-10 xl:px-12">
        <div className="rounded-[2rem] border border-white/70 bg-cream/82 p-3 shadow-[0_22px_60px_rgba(26,58,82,0.08)] backdrop-blur-sm sm:p-4 lg:rounded-[2.5rem] lg:p-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-stone/16">
            {stats.map(({ icon: Icon, value, label, note }) => (
              <div
                key={label}
                className="group relative min-h-[11rem] rounded-[1.5rem] bg-white/78 p-4 shadow-[0_10px_30px_rgba(26,58,82,0.06)] ring-1 ring-stone/8 transition-transform duration-300 hover:-translate-y-1 sm:p-5 lg:min-h-[13rem] lg:rounded-[2rem] lg:bg-transparent lg:shadow-none lg:ring-0"
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <Icon className="text-coral" size={25} strokeWidth={2} />
                  <span className="h-px flex-1 bg-stone/12" aria-hidden="true" />
                </div>
                <p className="font-serif text-[clamp(2rem,6vw,3.25rem)] font-semibold leading-none tracking-[-0.04em] text-[#0E125C]">
                  {value}
                </p>
                <p className="mt-3 text-[1rem] font-bold leading-tight text-ink">
                  {label}
                </p>
                <p className="mt-2 max-w-[20ch] text-[0.92rem] font-medium leading-snug text-stone">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
