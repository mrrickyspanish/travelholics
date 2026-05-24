import { StickyHeader } from "@/components/sticky-header";
import { Footer } from "@/components/footer";

export default function PrivacyPage() {
  return (
    <>
      <StickyHeader />
      <main className="min-h-screen bg-[#FAF9F6] pt-32 pb-20">
        <section className="mx-auto max-w-3xl px-6">
          <h1 className="text-4xl font-extrabold text-[#1e3a8a] mb-6">Privacy Policy</h1>
          <p className="text-slate-700 leading-relaxed mb-4">
            Travelholics collects contact information you submit through forms so we can respond to your
            inquiry and provide travel planning support.
          </p>
          <p className="text-slate-700 leading-relaxed mb-4">
            We do not sell your personal information. Form submissions may be processed by trusted providers
            like Supabase (data storage) and Resend (email delivery).
          </p>
          <p className="text-slate-700 leading-relaxed">
            If you want your information updated or removed, contact us at yo@travelholics.com.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
