const stats = [
  {
    value: "6+",
    label: "Cruise lines sailed",
    note: "Real ship experience, not brochure guesses",
  },
  {
    value: "20K+",
    label: "Travelers following along",
    note: "Daily cruise advice from Yolanda",
  },
  {
    value: "20+",
    label: "Years of travel experience",
    note: "A planner who has actually been there",
  },
  {
    value: "$0",
    label: "Planning fees",
    note: "Guidance without the markup",
  },
];

export const StatsStrip = () => {
  return (
    <section className="border-y border-ink/10 bg-[#fbf7ef]">
      <div className="mx-auto max-w-[96rem] px-5 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map(({ value, label, note }, index) => (
            <div
              key={label}
              className={`py-9 sm:py-12 lg:px-8 lg:py-14 ${index % 2 === 0 ? "pr-4" : "pl-4"} ${index < 3 ? "lg:border-r lg:border-ink/10" : ""} ${index >= 2 ? "border-t border-ink/10 lg:border-t-0" : ""}`}
            >
              <p className="font-serif text-[clamp(2.7rem,5vw,5.2rem)] font-semibold leading-none tracking-[-0.055em] text-royal-deep">{value}</p>
              <p className="mt-3 text-sm font-black text-ink sm:text-base">{label}</p>
              <p className="mt-2 max-w-[22ch] text-xs leading-5 text-stone sm:text-sm sm:leading-6">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
