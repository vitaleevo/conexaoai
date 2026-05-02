import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(path) {
  const content = readFileSync(path, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    process.env[key] ??= valueParts.join("=");
  }
}

loadEnv(resolve(process.cwd(), ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
}

const supabase = createClient(url, key);

const { data: visiblePosts, error: postsError } = await supabase
  .from("posts")
  .select("slug,status")
  .order("slug");

if (postsError) throw postsError;

const draftVisible = visiblePosts.some((post) => post.status !== "published");
if (draftVisible) {
  throw new Error("Anonymous users can see non-published posts.");
}

const { error: insertError } = await supabase
  .from("posts")
  .insert({ title: "Anon blocked", slug: `anon-blocked-${Date.now()}`, content: "blocked" });

if (!insertError) {
  throw new Error("Anonymous users can insert posts.");
}

console.log(`visible_published_posts=${visiblePosts.length}`);
console.log(`anon_insert_blocked=${insertError.message}`);
