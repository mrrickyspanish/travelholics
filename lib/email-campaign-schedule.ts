/**
 * Pure scheduling rules for drip campaigns. No database, no env, no mail
 * provider -- so `npm run check:email-campaigns` can exercise the decisions
 * that actually cause damage (sending twice, sending to someone who
 * unsubscribed, sending the whole drip at once) without standing anything up.
 */

export type CampaignStep = {
  id: string;
  position: number;
  delayHours: number;
  templateKey: string;
  subject: string;
};

export type SendRecord = {
  stepId: string;
  status: "pending" | "sent" | "failed";
  attempts: number;
};

export type Enrollment = {
  id: string;
  enrolledAt: Date;
  status: "active" | "completed" | "cancelled";
};

export type SubscriberState = {
  consentStatus: "subscribed" | "unsubscribed" | "pending";
  interests: string[];
};

export const MAX_SEND_ATTEMPTS = 3;

/** Only a confirmed subscriber is ever mailed. */
export function isMailable(subscriber: SubscriberState): boolean {
  return subscriber.consentStatus === "subscribed";
}

export function meetsTargeting(subscriber: SubscriberState, requiredInterest: string | null): boolean {
  if (!requiredInterest) return true;
  return subscriber.interests.includes(requiredInterest);
}

/**
 * Whether a subscriber should be enrolled in a campaign now.
 *
 * `enrollFrom` is the guard against mass-mailing the back catalogue: a
 * campaign activated today must not reach into years of existing subscribers
 * and send all of them step one at once.
 */
export function shouldEnroll({
  campaignStatus,
  enrollFrom,
  requiredInterest,
  subscriber,
  subscriberCreatedAt,
  alreadyEnrolled,
}: {
  campaignStatus: "draft" | "active" | "paused";
  enrollFrom: Date;
  requiredInterest: string | null;
  subscriber: SubscriberState;
  subscriberCreatedAt: Date;
  alreadyEnrolled: boolean;
}): boolean {
  if (campaignStatus !== "active") return false;
  if (alreadyEnrolled) return false;
  if (!isMailable(subscriber)) return false;
  if (!meetsTargeting(subscriber, requiredInterest)) return false;
  return subscriberCreatedAt.getTime() >= enrollFrom.getTime();
}

/**
 * The next step to send for one enrollment, or null.
 *
 * Returns at most one step per call even when several are overdue. A
 * subscriber who joined two weeks before a campaign is unpaused should not
 * receive five emails in one minute; one per run paces the catch-up.
 *
 * Steps are ordered by position and the first unsent one wins, so a step
 * stuck at `pending` blocks the ones behind it rather than being skipped
 * over -- the sequence is the point of a drip.
 */
export function nextDueStep({
  enrollment,
  steps,
  sends,
  now,
}: {
  enrollment: Enrollment;
  steps: CampaignStep[];
  sends: SendRecord[];
  now: Date;
}): CampaignStep | null {
  if (enrollment.status !== "active") return null;

  const byStep = new Map(sends.map((send) => [send.stepId, send]));
  const ordered = [...steps].sort((a, b) => a.position - b.position);

  for (const step of ordered) {
    const send = byStep.get(step.id);

    if (send?.status === "sent") continue;

    // A pending row means a worker already claimed this step, or died after
    // handing it to the provider. Neither is safe to send again: the
    // provider may have delivered it. Stop here rather than skipping ahead.
    if (send?.status === "pending") return null;

    if (send?.status === "failed" && send.attempts >= MAX_SEND_ATTEMPTS) return null;

    const dueAt = enrollment.enrolledAt.getTime() + step.delayHours * 3_600_000;
    if (now.getTime() < dueAt) return null;

    return step;
  }

  return null;
}

/** An enrollment is finished once every step has a confirmed send. */
export function isComplete(steps: CampaignStep[], sends: SendRecord[]): boolean {
  if (steps.length === 0) return false;
  const sent = new Set(sends.filter((send) => send.status === "sent").map((send) => send.stepId));
  return steps.every((step) => sent.has(step.id));
}
