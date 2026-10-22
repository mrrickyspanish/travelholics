import {
  MAX_SEND_ATTEMPTS,
  isComplete,
  isMailable,
  meetsTargeting,
  nextDueStep,
  shouldEnroll,
  type CampaignStep,
  type SendRecord,
} from "../lib/email-campaign-schedule";

let failures = 0;
function check(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) {
    failures += 1;
    console.error(`  ✗ ${label}\n      expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

const HOUR = 3_600_000;
const steps: CampaignStep[] = [
  { id: "s1", position: 1, delayHours: 0, templateKey: "a", subject: "A" },
  { id: "s2", position: 2, delayHours: 48, templateKey: "b", subject: "B" },
  { id: "s3", position: 3, delayHours: 120, templateKey: "c", subject: "C" },
];
const enrolledAt = new Date("2026-10-01T00:00:00Z");
const active = { id: "e1", enrolledAt, status: "active" as const };
const at = (hours: number) => new Date(enrolledAt.getTime() + hours * HOUR);

// --- suppression ----------------------------------------------------------
check("subscribed is mailable", isMailable({ consentStatus: "subscribed", interests: [] }), true);
check("unsubscribed is never mailable", isMailable({ consentStatus: "unsubscribed", interests: [] }), false);
check("pending is not mailable", isMailable({ consentStatus: "pending", interests: [] }), false);

// --- targeting ------------------------------------------------------------
check("no requirement matches everyone", meetsTargeting({ consentStatus: "subscribed", interests: [] }, null), true);
check("matching interest passes", meetsTargeting({ consentStatus: "subscribed", interests: ["guides"] }, "guides"), true);
check("missing interest fails", meetsTargeting({ consentStatus: "subscribed", interests: ["shop_deals"] }, "guides"), false);

// --- enrollment -----------------------------------------------------------
const enrollBase = {
  campaignStatus: "active" as const,
  enrollFrom: new Date("2026-10-01T00:00:00Z"),
  requiredInterest: null,
  subscriber: { consentStatus: "subscribed" as const, interests: [] },
  subscriberCreatedAt: new Date("2026-10-02T00:00:00Z"),
  alreadyEnrolled: false,
};
check("enrols a new subscriber", shouldEnroll(enrollBase), true);
check("draft campaign enrols nobody", shouldEnroll({ ...enrollBase, campaignStatus: "draft" }), false);
check("paused campaign enrols nobody", shouldEnroll({ ...enrollBase, campaignStatus: "paused" }), false);
check("never enrols twice", shouldEnroll({ ...enrollBase, alreadyEnrolled: true }), false);
check("never enrols an unsubscriber", shouldEnroll({ ...enrollBase, subscriber: { consentStatus: "unsubscribed", interests: [] } }), false);
// The back-catalogue guard: activating a campaign must not mail years of
// existing subscribers all at once.
check("does not enrol subscribers older than enroll_from", shouldEnroll({ ...enrollBase, subscriberCreatedAt: new Date("2026-09-30T23:59:59Z") }), false);
check("enrols exactly at enroll_from", shouldEnroll({ ...enrollBase, subscriberCreatedAt: new Date("2026-10-01T00:00:00Z") }), true);

// --- scheduling -----------------------------------------------------------
check("step 1 is due immediately", nextDueStep({ enrollment: active, steps, sends: [], now: at(0) })?.id, "s1");

const sentFirst: SendRecord[] = [{ stepId: "s1", status: "sent", attempts: 1 }];
check("step 2 not due before its delay", nextDueStep({ enrollment: active, steps, sends: sentFirst, now: at(47) }), null);
check("step 2 due at its delay", nextDueStep({ enrollment: active, steps, sends: sentFirst, now: at(48) })?.id, "s2");

// One per run: a long-overdue enrollment must not fire the whole sequence at once.
check(
  "only one step per run even when several are overdue",
  nextDueStep({ enrollment: active, steps, sends: sentFirst, now: at(1000) })?.id,
  "s2",
);

// A claimed-but-unconfirmed send must never be re-sent, and must not be
// skipped over either -- the provider may already have delivered it.
check(
  "pending step blocks rather than re-sending",
  nextDueStep({ enrollment: active, steps, sends: [{ stepId: "s1", status: "pending", attempts: 1 }], now: at(1000) }),
  null,
);

check(
  "failed step is retried while attempts remain",
  nextDueStep({ enrollment: active, steps, sends: [{ stepId: "s1", status: "failed", attempts: 1 }], now: at(0) })?.id,
  "s1",
);
check(
  "failed step stops at the attempt ceiling",
  nextDueStep({ enrollment: active, steps, sends: [{ stepId: "s1", status: "failed", attempts: MAX_SEND_ATTEMPTS }], now: at(0) }),
  null,
);

check("cancelled enrollment sends nothing", nextDueStep({ enrollment: { ...active, status: "cancelled" }, steps, sends: [], now: at(1000) }), null);
check("completed enrollment sends nothing", nextDueStep({ enrollment: { ...active, status: "completed" }, steps, sends: [], now: at(1000) }), null);

// Out-of-order step rows must not change the sequence.
check(
  "position, not row order, decides what is next",
  nextDueStep({ enrollment: active, steps: [steps[2], steps[0], steps[1]], sends: [], now: at(1000) })?.id,
  "s1",
);

// --- completion -----------------------------------------------------------
const allSent: SendRecord[] = steps.map((step) => ({ stepId: step.id, status: "sent", attempts: 1 }));
check("complete when every step is sent", isComplete(steps, allSent), true);
check("not complete with one outstanding", isComplete(steps, allSent.slice(0, 2)), false);
check("a pending row does not count as complete", isComplete(steps, [...allSent.slice(0, 2), { stepId: "s3", status: "pending", attempts: 1 }]), false);
check("no steps is not complete", isComplete([], []), false);
check("nothing is due once complete", nextDueStep({ enrollment: active, steps, sends: allSent, now: at(1000) }), null);

if (failures > 0) {
  console.error(`\n✗ email campaign checks failed: ${failures}`);
  process.exit(1);
}

console.log("✓ email campaigns clean — suppression, back-catalogue guard, one-step-per-run pacing, and no-resend-on-pending all hold");
