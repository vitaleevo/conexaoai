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

const email = process.env.CMS_TEST_EMAIL;
const password = process.env.CMS_TEST_PASSWORD;
if (!email || !password) {
  throw new Error("Set CMS_TEST_EMAIL and CMS_TEST_PASSWORD to run this smoke test.");
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const login = await supabase.auth.signInWithPassword({ email, password });
if (login.error) throw login.error;

const userId = login.data.user.id;
const author = await supabase.from("authors").select("id,email,role,user_id").eq("user_id", userId).single();
if (author.error) throw author.error;

const slug = `cms-validacao-${Date.now()}`;
const created = await supabase
  .from("posts")
  .insert({
    title: "Validação CMS autenticado",
    slug,
    content: "Post temporário para validar criação autenticada.",
    status: "draft",
    author_id: author.data.id,
  })
  .select("id,slug,status")
  .single();
if (created.error) throw created.error;

const updated = await supabase.from("posts").update({ status: "review" }).match({ id: created.data.id }).select("id,status").single();
if (updated.error) throw updated.error;

const removed = await supabase.from("posts").delete().match({ id: created.data.id });
if (removed.error) throw removed.error;

const png1x1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
  "base64",
);
const path = `validation/${Date.now()}.png`;
const upload = await supabase.storage.from("media").upload(path, png1x1, { contentType: "image/png" });
if (upload.error) throw upload.error;

const publicUrl = supabase.storage.from("media").getPublicUrl(path).data.publicUrl;
const asset = await supabase
  .from("media_assets")
  .insert({ file: publicUrl, storage_path: path, description: "Validação temporária" })
  .select("id,storage_path")
  .single();
if (asset.error) throw asset.error;

const assetDelete = await supabase.from("media_assets").delete().match({ id: asset.data.id });
if (assetDelete.error) throw assetDelete.error;

const storageDelete = await supabase.storage.from("media").remove([path]);
if (storageDelete.error) throw storageDelete.error;

await supabase.auth.signOut();

console.log(`login_user=${author.data.email}`);
console.log("post_create_update_delete=ok");
console.log("media_upload_delete=ok");
