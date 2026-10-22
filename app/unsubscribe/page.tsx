import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MailX } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UnsubscribeForm } from "./unsubscribe-form";
import { decodeEmailParam, verifyUnsubscribeToken } from "@/lib/newsletter-unsubscribe";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ e?: string; t?: string; done?: string }> };

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const email = params.e ? decodeEmailParam(params.e) : null;
  const token = params.t || "";
  const valid = Boolean(email && verifyUnsubscribeToken(email, token));
  const done = params.done === "1";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-sand px-5 pb-20 pt-28 sm:px-6 sm:pt-32">
        <div className="mx-auto max-w-xl">
          {done ? (
            <div className="rounded-[2rem] border border-ink/10 bg-cream p-7 text-center sm:p-9">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-mid text-white">
                <CheckCircle2 size={26} />
              </span>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1] tracking-[-0.04em] text-royal-deep">
                You&apos;re unsubscribed.
              </h1>
              <p className="mt-4 text-lg leading-7 text-stone">
                {email ? `${email} has been removed from` : "You have been removed from"} the
                Travelholics Cruise Life list. You will not receive any more marketing email from us.
              </p>
              <p className="mt-4 text-lg leading-7 text-stone">
                Anything already booked with Yolanda carries on as normal &mdash; this only stops the
                list email.
              </p>
              <Link
                href="/"
                className="mt-7 inline-flex min-h-11 items-center justify-center bg-coral px-6 py-3 text-base font-black uppercase tracking-[0.08em] text-white transition hover:bg-coral-deep"
              >
                Back to Travelholics
              </Link>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-ink/10 bg-cream p-7 sm:p-9">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink/8 text-ink">
                <MailX size={26} />
              </span>
              <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1] tracking-[-0.04em] text-royal-deep">
                Leaving the list?
              </h1>

              {valid && email ? (
                <>
                  <p className="mt-4 text-lg leading-7 text-stone">
                    Confirm and we&apos;ll stop sending Travelholics Cruise Life email to{" "}
                    <strong className="font-bold text-ink">{email}</strong>.
                  </p>
                  <UnsubscribeForm email={email} token={token} encodedEmail={params.e || ""} />
                </>
              ) : (
                <>
                  {/*
                    Reached without a usable signature. That happens with an old
                    link, a mail client that mangled the URL, or a forwarded
                    copy. Say so plainly and give a route that still works
                    rather than a dead end -- this page exists to honour a
                    promise the signup form makes.
                  */}
                  <p className="mt-4 text-lg leading-7 text-stone">
                    This unsubscribe link has expired or was altered in transit, so we can&apos;t
                    confirm which address it belongs to.
                  </p>
                  <p className="mt-4 text-lg leading-7 text-stone">
                    Use the <strong className="font-bold text-ink">Unsubscribe</strong> link at the
                    bottom of any recent Travelholics email, or email{" "}
                    <a href="mailto:news@yotravelholic.com" className="font-bold text-coral underline">
                      news@yotravelholic.com
                    </a>{" "}
                    and we&apos;ll remove you by hand.
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
