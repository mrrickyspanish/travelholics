import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

import { getUnlockableGuide, guideContentType } from "@/lib/free-guides";
import { verifyGuideToken } from "@/lib/guide-tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GUIDES_DIR = path.join(process.cwd(), "private", "guides");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const guideId = searchParams.get("guide") ?? "";
  const token = searchParams.get("token") ?? "";
  const expiresAt = Number(searchParams.get("expires"));

  const guide = getUnlockableGuide(guideId);

  if (!guide || !token) {
    return NextResponse.json({ error: "That guide isn't available." }, { status: 404 });
  }

  if (!verifyGuideToken(guide.id, expiresAt, token)) {
    return NextResponse.json(
      { error: "This download link has expired. Request the guide again." },
      { status: 403 },
    );
  }

  // guide.fileName comes from our own catalog, but resolve-and-check anyway so
  // the handler can never read outside the guides directory.
  const filePath = path.join(GUIDES_DIR, guide.fileName);

  if (path.dirname(filePath) !== GUIDES_DIR) {
    return NextResponse.json({ error: "That guide isn't available." }, { status: 404 });
  }

  let file: Buffer;

  try {
    file = await readFile(filePath);
  } catch (error) {
    console.error(`Guide file missing on disk: ${guide.fileName}`, error);
    return NextResponse.json({ error: "That guide isn't available." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(file), {
    headers: {
      "Content-Type": guideContentType(guide),
      "Content-Length": String(file.byteLength),
      "Content-Disposition": `attachment; filename="${guide.downloadName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
