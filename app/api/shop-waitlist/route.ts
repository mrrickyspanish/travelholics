import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { sendAlert } from "@/lib/alerts";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Database not configured." }, { status: 500 });
  }

  const body = (await request.json()) as { first_name?: string; email?: string };
  const { first_name, email } = body;

  if (!first_name?.trim() || !email?.trim() || !email.includes("@")) {
    return NextResponse.json({ error: "Name and valid email are required." }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("shop_waitlist").insert({
    first_name: first_name.trim(),
    email: email.trim().toLowerCase(),
    source: "shop-coming-soon",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: true, already: true });
    }
    console.error("Shop waitlist insert failed:", error);
    await sendAlert("Shop waitlist signup failed to save", { email, error: error.message });
    return NextResponse.json({ error: "Unable to save your signup." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
