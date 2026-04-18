"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Database } from "@/types/supabase";

export type DesignRow = Database["public"]["Tables"]["designs"]["Row"];
export type DesignInsert = Database["public"]["Tables"]["designs"]["Insert"];
export type DesignUpdate = Database["public"]["Tables"]["designs"]["Update"];

export interface DesignFormData {
  name: string;
  slug: string;
  url: string;
  category: string;
  content: string;
  is_published: boolean;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getAllDesigns(): Promise<DesignRow[]> {
  const { data, error } = await supabaseAdmin
    .from("designs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch designs: ${error.message}`);
  }

  return data || [];
}

export async function getPublishedDesigns(): Promise<Pick<DesignRow, "id" | "name" | "slug" | "url" | "category" | "created_at">[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("designs")
      .select("id, name, slug, url, category, created_at")
      .eq("is_published", true)
      .order("name", { ascending: true });

    if (error) {
      console.error(`Database Error: ${error.message}`);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error(`Network or Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return [];
  }
}

export async function getDesignBySlug(slug: string): Promise<DesignRow> {
  const { data, error } = await supabaseAdmin
    .from("designs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    throw new Error(`Design not found: ${error.message}`);
  }

  return data;
}

export async function getDesignById(id: string): Promise<DesignRow> {
  const { data, error } = await supabaseAdmin
    .from("designs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(`Design not found: ${error.message}`);
  }

  return data;
}

export async function createDesign(formData: DesignFormData): Promise<DesignRow> {
  const slug = formData.slug || generateSlug(formData.name);

  const { data, error } = await (supabaseAdmin.from("designs") as any)
    .insert({
      name: formData.name,
      slug,
      url: formData.url,
      category: formData.category,
      content: formData.content,
      is_published: formData.is_published,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create design: ${error.message}`);
  }

  revalidatePath("/admin/designs");
  revalidatePath("/browse");
  
  return data as DesignRow;
}

export async function updateDesign(id: string, formData: DesignFormData): Promise<DesignRow> {
  const slug = formData.slug || generateSlug(formData.name);

  const { data, error } = await (supabaseAdmin.from("designs") as any)
    .update({
      name: formData.name,
      slug,
      url: formData.url,
      category: formData.category,
      content: formData.content,
      is_published: formData.is_published,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update design: ${error.message}`);
  }

  revalidatePath("/admin/designs");
  revalidatePath("/browse");
  
  return data as DesignRow;
}

export async function deleteDesign(id: string): Promise<{ success: boolean }> {
  const { error } = await supabaseAdmin
    .from("designs")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to delete design: ${error.message}`);
  }

  revalidatePath("/admin/designs");
  revalidatePath("/browse");
  
  return { success: true };
}

export async function searchDesigns(query: string): Promise<Pick<DesignRow, "id" | "name" | "slug" | "url" | "category" | "created_at">[]> {
  const { data, error } = await supabaseAdmin
    .from("designs")
    .select("id, name, slug, url, category, created_at")
    .eq("is_published", true)
    .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to search designs: ${error.message}`);
  }

  return data || [];
}