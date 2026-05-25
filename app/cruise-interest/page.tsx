"use client";

import { useState } from "react";
import { Anchor, CheckCircle2, Ship } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { supabase } from "@/lib/supabase";
import { sendFormEmail } from "@/lib/form-email";
import { RippleButton } from "@/components/ripple-button";

type ContactMethod = "Email" | "Text" | "Phone Call";
type ChildrenTraveling = "Yes" | "No" | "Not sure";
type CruiseLength = "3–4 nights" | "5–7 nights" | "8+ nights" | "Flexible / not sure";
type BudgetRange =
  | "Under $1,500 total"
  | "$1,500 to $3,000 total"
  | "$3,000 to $5,000 total"
  | "$5,000+"
  | "Not sure yet";
type CruisedBefore = "Yes" | "No";

type CruiseInterestFormData = {
  fullName: string;
  email: string;
  phone: string;
  preferredContactMethod: ContactMethod;
  travelers: string;
  childrenTraveling: ChildrenTraveling;
  cruiseLinePreference: string;
  destinationPreference: string;
  timeOfYear: string;
  cruiseLength: CruiseLength;
  departurePortPreference: string;
  budgetRange: BudgetRange;
  cruisedBefore: CruisedBefore;
  celebration: string;
  additionalNotes: string;
};

const initialFormData: CruiseInterestFormData = {
  fullName: "",
  email: "",
  phone: "",
  preferredContactMethod: "Email",
  travelers: "",
  childrenTraveling: "Not sure",
  cruiseLinePreference: "No preference",
  destinationPreference: "No preference",
  timeOfYear: "",
  cruiseLength: "Flexible / not sure",
  departurePortPreference: "",
  budgetRange: "Not sure yet",
  cruisedBefore: "No",
  celebration: "",
  additionalNotes: "",
};

const cruiseLineOptions = [
  "Royal Caribbean",
  "Carnival",
  "Norwegian",
  "Princess",
  "MSC",
  "Celebrity",
  "Disney",
  "Virgin Voyages",
  "No preference",
  "Other",
];

const destinationOptions = [
  "Caribbean",
  "Bahamas",
  "Mexico",
  "Alaska",
  "Mediterranean",
  "Europe",
  "Bermuda",
  "Hawaii",
  "Panama Canal",
  "Canada / New England",
  "No preference",
  "Other",
];

const cruiseLengthOptions: CruiseLength[] = [
  "3–4 nights",
  "5–7 nights",
  "8+ nights",
  "Flexible / not sure",
];

const budgetOptions: BudgetRange[] = [
  "Under $1,500 total",
  "$1,500 to $3,000 total",
  "$3,000 to $5,000 total",
  "$5,000+",
  "Not sure yet",
];

const contactOptions: ContactMethod[] = ["Email", "Text", "Phone Call"];
const childrenOptions: ChildrenTraveling[] = ["Yes", "No", "Not sure"];
const cruisedBeforeOptions: CruisedBefore[] = ["Yes", "No"];

function buildInquiryMessage(data: CruiseInterestFormData) {
  return [
    "Cruise Interest Intake",
    `Preferred Contact Method: ${data.preferredContactMethod}`,
    `How Many Travelers: ${data.travelers}`,
    `Any Children Traveling: ${data.childrenTraveling}`,
    `Cruise Line Preference: ${data.cruiseLinePreference}`,
    `Destination Preference: ${data.destinationPreference}`,
    `Time Of Year: ${data.timeOfYear}`,
    `Preferred Cruise Length: ${data.cruiseLength}`,
    `Departure Port Preference: ${data.departurePortPreference}`,
    `Comfortable Budget Range: ${data.budgetRange}`,
    `Have You Cruised Before: ${data.cruisedBefore}`,
    `Celebration Or Occasion: ${data.celebration || "None provided"}`,
    `Anything Else I Should Know: ${data.additionalNotes || "None provided"}`,
  ].join("\n");
}

export default function CruiseInterestPage() {
  const [formData, setFormData] = useState<CruiseInterestFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [website, setWebsite] = useState("");

  const setField = <K extends keyof CruiseInterestFormData>(
    key: K,
    value: CruiseInterestFormData[K],
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    if (website.trim()) {
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      if (supabase) {
        const { error } = await supabase.from("cruise_inquiries").insert([
          {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone || null,
            message: buildInquiryMessage(formData),
          },
        ]);

        if (error) {
          console.warn("Supabase insert failed, continuing with email send:", error);
        }
      }

      await sendFormEmail({
        formType: "cruise-interest",
        ...formData,
      });

      setIsSuccess(true);
      setFormData(initialFormData);
      setWebsite("");
    } catch (error) {
      console.error("Error submitting cruise interest form:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-[#FAF9F6] min-h-screen pt-36 pb-24">
        <section className="max-w-5xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#059669] mb-3">
              Cruise Lead Intake
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1e3a8a] mb-4 leading-tight">
              Start Planning Your Cruise
            </h1>
            <p className="text-slate-600 text-base lg:text-lg leading-relaxed">
              Tell us a little about what you&apos;re looking for, even if you&apos;re still early in the process. We&apos;ll use this to help narrow down cruise lines, destinations, timing, and options that fit your travel style.
            </p>
          </div>

          <div className="rounded-3xl border border-[#d6dfd8] bg-white p-6 md:p-8 lg:p-10 shadow-xl shadow-[#123a2f]/5">
            {isSuccess ? (
              <div className="py-14 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-50 text-[#059669] flex items-center justify-center">
                  <CheckCircle2 size={34} />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-[#1e3a8a] mb-3">
                  You&apos;re All Set
                </h2>
                <p className="text-slate-600 leading-relaxed mb-7">
                  Thanks! Your cruise interest form has been received. We&apos;ll review your details and follow up with next steps.
                </p>
                <RippleButton
                  onClick={() => setIsSuccess(false)}
                  className="bg-[#059669] hover:bg-[#047857] text-white font-bold px-6 py-3 rounded-xl"
                >
                  Submit Another Response
                </RippleButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                <div className="rounded-2xl border border-[#e4e7eb] bg-[#fafcff] p-5">
                  <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">Contact Details</h2>
                  <p className="text-sm text-slate-500 mb-5">
                    We&apos;ll use your preferred contact method to follow up with curated cruise options.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Full Name</span>
                      <input
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(event) => setField("fullName", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="Jane Smith"
                        autoComplete="name"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Email Address</span>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(event) => setField("email", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="jane@email.com"
                        autoComplete="email"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Phone Number</span>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(event) => setField("phone", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="(555) 000-0000"
                        autoComplete="tel"
                      />
                    </label>

                    <fieldset className="space-y-2">
                      <legend className="text-sm font-semibold text-slate-700">Preferred Contact Method</legend>
                      <div className="flex flex-wrap gap-2">
                        {contactOptions.map((option) => (
                          <label
                            key={option}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                          >
                            <input
                              type="radio"
                              name="preferredContactMethod"
                              checked={formData.preferredContactMethod === option}
                              onChange={() => setField("preferredContactMethod", option)}
                              className="accent-[#059669]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e4e7eb] bg-[#fffdf8] p-5">
                  <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">Trip Basics</h2>
                  <p className="text-sm text-slate-500 mb-5">
                    Share your current preferences so we can narrow to the best-fit cruise options.
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">How many travelers?</span>
                      <input
                        required
                        type="number"
                        min={1}
                        value={formData.travelers}
                        onChange={(event) => setField("travelers", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="2"
                      />
                    </label>

                    <fieldset className="space-y-2">
                      <legend className="text-sm font-semibold text-slate-700">Any children traveling?</legend>
                      <div className="flex flex-wrap gap-2">
                        {childrenOptions.map((option) => (
                          <label
                            key={option}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                          >
                            <input
                              type="radio"
                              name="childrenTraveling"
                              checked={formData.childrenTraveling === option}
                              onChange={() => setField("childrenTraveling", option)}
                              className="accent-[#059669]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Cruise line preference</span>
                      <select
                        value={formData.cruiseLinePreference}
                        onChange={(event) => setField("cruiseLinePreference", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                      >
                        {cruiseLineOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Destination preference</span>
                      <select
                        value={formData.destinationPreference}
                        onChange={(event) => setField("destinationPreference", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                      >
                        {destinationOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Time of year you&apos;d like to travel</span>
                      <input
                        type="text"
                        value={formData.timeOfYear}
                        onChange={(event) => setField("timeOfYear", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="Spring 2027 or late summer"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Preferred cruise length</span>
                      <select
                        value={formData.cruiseLength}
                        onChange={(event) => setField("cruiseLength", event.target.value as CruiseLength)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                      >
                        {cruiseLengthOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Departure port preference</span>
                      <input
                        type="text"
                        value={formData.departurePortPreference}
                        onChange={(event) => setField("departurePortPreference", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="Miami, Port Canaveral, Galveston, etc."
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Comfortable budget range</span>
                      <select
                        value={formData.budgetRange}
                        onChange={(event) => setField("budgetRange", event.target.value as BudgetRange)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                      >
                        {budgetOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>

                    <fieldset className="space-y-2 md:col-span-2">
                      <legend className="text-sm font-semibold text-slate-700">Have you cruised before?</legend>
                      <div className="flex flex-wrap gap-2">
                        {cruisedBeforeOptions.map((option) => (
                          <label
                            key={option}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600"
                          >
                            <input
                              type="radio"
                              name="cruisedBefore"
                              checked={formData.cruisedBefore === option}
                              onChange={() => setField("cruisedBefore", option)}
                              className="accent-[#059669]"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#e4e7eb] bg-[#fafcff] p-5">
                  <h2 className="text-xl font-bold text-[#1e3a8a] mb-2">Final Notes</h2>
                  <p className="text-sm text-slate-500 mb-5">
                    Optional details help us personalize recommendations from the very first follow-up.
                  </p>

                  <div className="grid gap-4">
                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Celebration or occasion?</span>
                      <input
                        type="text"
                        value={formData.celebration}
                        onChange={(event) => setField("celebration", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20"
                        placeholder="Birthday, anniversary, graduation, or just a getaway"
                      />
                    </label>

                    <label className="space-y-1.5">
                      <span className="text-sm font-semibold text-slate-700">Anything else I should know?</span>
                      <textarea
                        rows={5}
                        value={formData.additionalNotes}
                        onChange={(event) => setField("additionalNotes", event.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 resize-y"
                        placeholder="Share preferences, cabin priorities, accessibility needs, or any details that matter to your trip."
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

                <div className="rounded-2xl border border-[#d9e5dd] bg-[#f4f8f6] p-5 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#059669]/15 text-[#059669] flex items-center justify-center shrink-0">
                      <Anchor size={18} />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Early stage is perfect. You don&apos;t need all the answers yet — this gives us enough to curate your best next options.
                    </p>
                  </div>

                  <RippleButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto bg-[#059669] hover:bg-[#047857] text-white font-bold px-8 py-3 rounded-xl inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        Submit Cruise Interest <Ship size={17} />
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
