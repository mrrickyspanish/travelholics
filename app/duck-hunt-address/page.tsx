"use client";

import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, MapPin, Send } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Breadcrumb } from "@/components/breadcrumb";
import { sendFormEmail } from "@/lib/form-email";
import { RippleButton } from "@/components/ripple-button";

// ------------------------------------------------------------------
// Duck Hunt mailing address collection
//
// Built for the QR registrants who signed up before the claim form
// asked for an address. The email they get links here (optionally with
// ?email= prefilled), and the submission UPDATES their existing
// duck_hunt_leads row instead of creating a second, disconnected one.
//
// Structure, spacing, input styling, honeypot and success state all
// follow /cruise-interest so it reads as part of the site rather than
// a one-off campaign page.
// ------------------------------------------------------------------

type DuckHuntAddressFormData = {
  firstName: string;
  lastName: string;
  email: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
};

const initialFormData: DuckHuntAddressFormData = {
  firstName: "",
  lastName: "",
  email: "",
  shippingAddress1: "",
  shippingAddress2: "",
  shippingCity: "",
  shippingState: "",
  shippingZip: "",
};

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI",
  "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN",
  "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH",
  "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA",
  "VI", "WA", "WV", "WI", "WY",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20";

function DuckHuntAddressForm() {
  const [formData, setFormData] = useState<DuckHuntAddressFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [website, setWebsite] = useState("");

  // The campaign email can carry the registrant's details in the link
  // (?email=&first=&last=) so most people only have to type an address.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email") || params.get("e") || "";
    const firstName = params.get("first") || params.get("fname") || "";
    const lastName = params.get("last") || params.get("lname") || "";

    if (!email && !firstName && !lastName) return;

    setFormData((current) => ({
      ...current,
      email: email.trim() || current.email,
      firstName: firstName.trim() || current.firstName,
      lastName: lastName.trim() || current.lastName,
    }));
  }, []);

  const setField = <K extends keyof DuckHuntAddressFormData>(
    key: K,
    value: DuckHuntAddressFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (website.trim()) {
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/duck-hunt/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = (await response.json().catch(() => null)) as
        | { error?: string; matched?: boolean }
        | null;

      if (!response.ok) {
        throw new Error(result?.error || "Unable to save your mailing address.");
      }

      setIsSuccess(true);

      // The address is safely stored at this point. The internal
      // notification is a best-effort side effect — a Resend hiccup must
      // never bounce someone back to an error state and risk a duplicate.
      sendFormEmail({
        formType: "duck-hunt-address",
        ...formData,
        matched: result?.matched ?? null,
      }).catch((emailError) => {
        console.error(
          "Duck Hunt address notification email failed (address already saved):",
          emailError,
        );
      });
    } catch (error) {
      console.error("Error submitting Duck Hunt address form:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-[#FAF9F6] min-h-screen pt-28 pb-24">
        <section className="max-w-3xl mx-auto px-6">
          <Breadcrumb
            crumbs={[{ label: "Home", href: "/" }, { label: "Duck Hunt Magnet" }]}
          />
          <div className="mt-6" />
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#059669] mb-3">
              Duck Hunt Reward
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] mb-4 leading-tight">
              Where Should We Ship Your Magnet?
            </h1>
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
              You already claimed your Travelholics Cruise Life magnet — we just
              need a mailing address to send it. Use the same email you
              registered with and we&apos;ll attach the address to your existing
              entry.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d6dfd8] bg-white p-6 md:p-8 lg:p-10 shadow-xl shadow-[#123a2f]/5">
            {isSuccess ? (
              <div className="py-14 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
                  <CheckCircle2 size={34} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-3">
                  Address Received
                </h2>
                <p className="text-slate-600 leading-relaxed mb-7">
                  Thanks! Your magnet ships within 2–3 weeks to the address you
                  gave us. Watch your inbox for the confirmation.
                </p>
                <RippleButton
                  onClick={() => {
                    setIsSuccess(false);
                    setFormData(initialFormData);
                    setWebsite("");
                  }}
                  className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-3 rounded-xl"
                >
                  Submit Another Address
                </RippleButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                <div className="rounded-2xl border border-[#e4e7eb] bg-[#fafcff] p-5">
                  <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">
                    Confirm It&apos;s You
                  </h2>
                  <p className="text-sm text-slate-500 mb-5">
                    Use the same email you used when you scanned the duck — that&apos;s
                    how we match this to your existing entry.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">First Name</span>
                      <input
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(event) => setField("firstName", event.target.value)}
                        className={inputClass}
                        placeholder="Jane"
                        autoComplete="given-name"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Last Name</span>
                      <input
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(event) => setField("lastName", event.target.value)}
                        className={inputClass}
                        placeholder="Smith"
                        autoComplete="family-name"
                      />
                    </label>

                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Email Address</span>
                      <input
                        required
                        type="email"
                        inputMode="email"
                        value={formData.email}
                        onChange={(event) => setField("email", event.target.value)}
                        className={inputClass}
                        placeholder="jane@email.com"
                        autoComplete="email"
                      />
                    </label>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e4e7eb] bg-[#fffdf8] p-5">
                  <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">Mailing Address</h2>
                  <p className="text-sm text-slate-500 mb-5">
                    US addresses only for now. Double-check the apartment or suite
                    number — it&apos;s the most common reason a magnet comes back.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">Street Address</span>
                      <input
                        required
                        type="text"
                        value={formData.shippingAddress1}
                        onChange={(event) => setField("shippingAddress1", event.target.value)}
                        className={inputClass}
                        placeholder="123 Harbor Lane"
                        autoComplete="address-line1"
                      />
                    </label>

                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">
                        Apt / Suite <span className="font-normal text-slate-400">(optional)</span>
                      </span>
                      <input
                        type="text"
                        value={formData.shippingAddress2}
                        onChange={(event) => setField("shippingAddress2", event.target.value)}
                        className={inputClass}
                        placeholder="Apt 4B"
                        autoComplete="address-line2"
                      />
                    </label>

                    <label className="space-y-1.5 md:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">City</span>
                      <input
                        required
                        type="text"
                        value={formData.shippingCity}
                        onChange={(event) => setField("shippingCity", event.target.value)}
                        className={inputClass}
                        placeholder="Port Canaveral"
                        autoComplete="address-level2"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">State</span>
                      <select
                        required
                        value={formData.shippingState}
                        onChange={(event) => setField("shippingState", event.target.value)}
                        className={inputClass}
                        autoComplete="address-level1"
                      >
                        <option value="">Select state</option>
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">ZIP Code</span>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]{5}(-[0-9]{4})?"
                        value={formData.shippingZip}
                        onChange={(event) => setField("shippingZip", event.target.value)}
                        className={inputClass}
                        placeholder="32920"
                        autoComplete="postal-code"
                      />
                    </label>
                  </div>
                </div>

                <div
                  className="absolute -left-[10000px] top-auto w-px h-px overflow-hidden"
                  aria-hidden="true"
                >
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm font-medium text-red-600 text-center">{errorMessage}</p>
                )}

                <div className="rounded-2xl border border-[#d9e5dd] bg-[#f4f8f6] p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#059669]/15 text-[#059669] flex items-center justify-center shrink-0">
                      <MapPin size={18} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      We only use this address to mail your magnet. Nothing else,
                      no sharing, no resale.
                    </p>
                  </div>

                  <RippleButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        Send My Magnet <Send size={17} />
                      </>
                    )}
                  </RippleButton>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function DuckHuntAddressPage() {
  return (
    <Suspense fallback={null}>
      <DuckHuntAddressForm />
    </Suspense>
  );
}
