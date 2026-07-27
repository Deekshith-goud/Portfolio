import { hookSecret } from "@/sanity/lib/env.api";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  if (!hookSecret) {
    console.error("Missing SANITY_HOOK_SECRET");
    return new Response("Server Configuration Error", { status: 500 });
  }

  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: string | undefined;
    }>(req, hookSecret);

    if (!isValidSignature) {
      return new Response("Invalid Signature", { status: 401 });
    }

    if (!body?._type) {
      return new Response("Bad Request", { status: 400 });
    }

    // Map Sanity _type to Next.js fetch tags
    const typeToTag: Record<string, string> = {
      post: "Post",
      hero: "heroe",
      profile: "profile",
      hobby: "hobby",
      job: "job",
      photo: "photo",
      project: "project",
    };
    const tag = typeToTag[body._type] || body._type;
    
    // Pass "default" profile to satisfy Next.js 16 signature cleanly
    revalidateTag(tag, "default");
    
    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    });
  } catch (error: any) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
