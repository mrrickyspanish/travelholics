// ⚠️ REAL TESTIMONIALS PENDING — DO NOT FABRICATE
// Per Ricky's no-fake-content policy, this component returns null until real quotes arrive.
// When Yolanda delivers testimonials:
//   1. Set RENDER_TESTIMONIALS = true
//   2. Populate the TESTIMONIALS array below with real data
// Do not display made-up quotes under any circumstances.

const RENDER_TESTIMONIALS = false;

interface Testimonial {
  quote: string;
  name: string;
  trip: string;
}

// Populate with real testimonials when available
const TESTIMONIALS: Testimonial[] = [];

export const Testimonials = () => {
  if (!RENDER_TESTIMONIALS) return null;

  return (
    <section id="testimonials" className="bg-sand py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="type-kicker text-coral mb-3">What Travelers Are Saying</p>
          <h2 className="type-section-title text-emerald-deep">Real People. Real Memories.</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ quote, name, trip }) => (
            <div key={name} className="bg-cream rounded-2xl p-6 shadow-sm border border-blush">
              <div className="flex gap-0.5 mb-4" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-coral fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-ink/80 leading-relaxed mb-4 italic">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="text-sm font-bold text-ink">— {name}</p>
              <p className="text-xs text-coral mt-0.5">{trip}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
