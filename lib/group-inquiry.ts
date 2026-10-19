export function validateGroupInquiryContact(body: Record<string, unknown>): string | null {
  const name = String(body.leaderName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const contact = String(body.preferredContact ?? "");
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please add your name and a valid email address.";
  if (!["phone", "text", "email"].includes(contact)) return "Choose how you prefer Yolanda to contact you.";
  if (!String(body.groupType ?? "").trim()) return "Choose what is bringing your group together.";
  const phone = String(body.phone ?? "").replace(/\D/g, "");
  if (contact !== "email" && (phone.length < 7 || phone.length > 15)) return "Please add a phone number for your preferred contact method.";
  if (contact === "text" && body.smsConsent !== true) return "Please agree to inquiry-related text messages or choose email.";
  for (const [key, label] of [["estimatedGroupSize", "traveler"], ["estimatedCabins", "cabin"]]) {
    const value = body[key];
    if (value == null || String(value).trim() === "") continue;
    const count = Number(value);
    if (!Number.isSafeInteger(count) || count < (key === "estimatedGroupSize" ? 2 : 1)) return `Please enter a valid ${label} estimate, or leave it blank if you are not sure.`;
  }
  return null;
}

/** Keep qualification details in the existing notes field, without a schema migration. */
export function buildGroupInquiryNotes(body: Record<string, unknown>): string {
  const cabins = String(body.estimatedCabins ?? "").trim();
  const budget = String(body.budgetPerPerson ?? "").trim().slice(0, 120);
  return [
    cabins ? `Estimated cabins: ${cabins}` : "",
    budget ? `Cruise budget per person (before flights): ${budget}` : "",
    String(body.notes ?? "").trim().slice(0, 4000),
  ].filter(Boolean).join("\n");
}
