import { getAdminClient } from "@/lib/auth/session";
import type {
  AcademyProgram,
  GeneralSettings,
  MediaAsset,
  PricingSettings,
  Tournament,
} from "@/types/admin";

const DEFAULT_PRICING: PricingSettings = {
  individualPriceUgx: 10_000,
  teamHourlyPriceUgx: 80_000,
  currency: "UGX",
};

const DEFAULT_GENERAL: GeneralSettings = {
  siteName: "Kidza Arena",
  bookingApprovalRequired: true,
  maintenanceMode: false,
};

export async function getPricingSettings(): Promise<PricingSettings> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "pricing")
    .single();

  if (!data?.value || typeof data.value !== "object") return DEFAULT_PRICING;
  return { ...DEFAULT_PRICING, ...(data.value as PricingSettings) };
}

export async function updatePricingSettings(
  settings: PricingSettings,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "pricing",
    value: settings,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "general")
    .single();

  if (!data?.value || typeof data.value !== "object") return DEFAULT_GENERAL;
  return { ...DEFAULT_GENERAL, ...(data.value as GeneralSettings) };
}

export async function updateGeneralSettings(
  settings: GeneralSettings,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("site_settings").upsert({
    key: "general",
    value: settings,
    updated_at: new Date().toISOString(),
  });
  return { error: error?.message ?? null };
}

export async function listMediaAssets(): Promise<MediaAsset[]> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("media_assets")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as MediaAsset[];
}

export async function upsertMediaAsset(
  asset: Omit<MediaAsset, "created_at"> & { created_at?: string },
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("media_assets").upsert(asset);
  return { error: error?.message ?? null };
}

export async function deleteMediaAsset(id: string): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function listAcademyPrograms(): Promise<AcademyProgram[]> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("academy_programs")
    .select("*")
    .order("sort_order")
    .order("created_at", { ascending: false });
  return (data ?? []) as AcademyProgram[];
}

export async function upsertAcademyProgram(
  program: Partial<AcademyProgram> & { title: string },
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("academy_programs").upsert(program);
  return { error: error?.message ?? null };
}

export async function deleteAcademyProgram(
  id: string,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("academy_programs").delete().eq("id", id);
  return { error: error?.message ?? null };
}

export async function listTournaments(): Promise<Tournament[]> {
  const { supabase } = await getAdminClient();
  const { data } = await supabase
    .from("tournaments")
    .select("*")
    .order("start_date", { ascending: false });
  return (data ?? []) as Tournament[];
}

export async function upsertTournament(
  tournament: Partial<Tournament> & { title: string },
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("tournaments").upsert(tournament);
  return { error: error?.message ?? null };
}

export async function deleteTournament(
  id: string,
): Promise<{ error: string | null }> {
  const { supabase } = await getAdminClient();
  const { error } = await supabase.from("tournaments").delete().eq("id", id);
  return { error: error?.message ?? null };
}
