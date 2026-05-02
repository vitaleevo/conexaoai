"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseActionClient, createSupabaseAdminClient } from "@/lib/supabase-admin";

export type CreateCmsUserState = {
  success: boolean;
  message: string;
};

const createCmsUserSchema = z.object({
  name: z.string().trim().min(2, "Name is too short.").max(120, "Name is too long."),
  email: z.email("Invalid email.").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters.").max(120, "Password is too long."),
  role: z.enum(["admin", "manager", "editor", "author", "viewer"]),
});

export async function createCmsUserAction(_previousState: CreateCmsUserState, formData: FormData): Promise<CreateCmsUserState> {
  try {
    const supabase = await createSupabaseActionClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, message: "Session expired. Please sign in again." };
    }

    const { data: currentAuthor, error: currentAuthorError } = await supabase
      .from("authors")
      .select("role")
      .eq("user_id", user.id)
      .maybeSingle();

    if (currentAuthorError) {
      return { success: false, message: currentAuthorError.message };
    }

    if (currentAuthor?.role !== "admin") {
      return { success: false, message: "Only admins can create users." };
    }

    const parsed = createCmsUserSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    });

    if (!parsed.success) {
      return { success: false, message: parsed.error.issues[0]?.message ?? "Invalid data." };
    }

    const adminClient = createSupabaseAdminClient();
    const { name, email, password, role } = parsed.data;

    const { data: createdUser, error: createUserError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
      app_metadata: {
        role,
      },
    });

    if (createUserError || !createdUser.user) {
      return { success: false, message: createUserError?.message ?? "Could not create the user." };
    }

    const { data: existingAuthor, error: existingAuthorError } = await adminClient
      .from("authors")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingAuthorError) {
      return { success: false, message: existingAuthorError.message };
    }

    if (existingAuthor?.id) {
      const { error } = await adminClient
        .from("authors")
        .update({
          name,
          email,
          role,
          user_id: createdUser.user.id,
        })
        .eq("id", existingAuthor.id);

      if (error) {
        return { success: false, message: error.message };
      }
    } else {
      const { error } = await adminClient.from("authors").insert({
        name,
        email,
        role,
        user_id: createdUser.user.id,
      });

      if (error) {
        return { success: false, message: error.message };
      }
    }

    revalidatePath("/cms/authors");
    return { success: true, message: `User ${email} created with the ${role} role.` };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unexpected failure while creating the user.",
    };
  }
}
