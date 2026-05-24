import { StickyHeader } from "@/components/sticky-header";
import { Footer } from "@/components/footer";

export default function TermsPage() {
  return (
    <>
      <StickyHeader />
      <main className="min-h-screen bg-[#FAF9F6] pt-32 pb-20">
        <section className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-6">Terms of Use</h1>
          <p className="text-slate-700 leading-relaxed mb-4">
            By using Travelholics, you agree to use this site for lawful purposes and provide accurate
            information when submitting forms.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            Travel recommendations are provided for planning guidance and may change based on availability,
            supplier terms, and pricing at time of booking.
          </p>
          <p className="text-slate-700 leading-relaxed">
            For questions about these terms, contact yo@travelholics.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
