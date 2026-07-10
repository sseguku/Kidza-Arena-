"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import {
  updateBookingStatus,
  updatePaymentStatus,
} from "@/services/admin/bookings";
import {
  deleteAcademyProgram,
  deleteMediaAsset,
  deleteTournament,
  updateGeneralSettings,
  updatePricingSettings,
  upsertAcademyProgram,
  upsertMediaAsset,
  upsertTournament,
} from "@/services/admin/content";
import type { BookingStatus, PaymentStatus } from "@/types/database";
import type {
  AcademyProgram,
  GeneralSettings,
  MediaAsset,
  PricingSettings,
  Tournament,
} from "@/types/admin";

async function guard() {
  await requireAdmin();
}

export async function updateBookingStatusAction(
  id: string,
  status: BookingStatus,
) {
  await guard();
  const result = await updateBookingStatus(id, status);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/calendar");
  return result;
}

export async function updatePaymentStatusAction(
  id: string,
  paymentStatus: PaymentStatus,
) {
  await guard();
  const result = await updatePaymentStatus(id, paymentStatus);
  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/statistics");
  return result;
}

export async function savePricingAction(settings: PricingSettings) {
  await guard();
  const result = await updatePricingSettings(settings);
  revalidatePath("/admin/pricing");
  return result;
}

export async function saveGeneralSettingsAction(settings: GeneralSettings) {
  await guard();
  const result = await updateGeneralSettings(settings);
  revalidatePath("/admin/settings");
  return result;
}

export async function saveMediaAssetAction(
  asset: Omit<MediaAsset, "created_at">,
) {
  await guard();
  const result = await upsertMediaAsset(asset);
  revalidatePath("/admin/media");
  return result;
}

export async function deleteMediaAssetAction(id: string) {
  await guard();
  const result = await deleteMediaAsset(id);
  revalidatePath("/admin/media");
  return result;
}

export async function saveAcademyProgramAction(
  program: Partial<AcademyProgram> & { title: string },
) {
  await guard();
  const result = await upsertAcademyProgram(program);
  revalidatePath("/admin/academy");
  return result;
}

export async function deleteAcademyProgramAction(id: string) {
  await guard();
  const result = await deleteAcademyProgram(id);
  revalidatePath("/admin/academy");
  return result;
}

export async function saveTournamentAction(
  tournament: Partial<Tournament> & { title: string },
) {
  await guard();
  const result = await upsertTournament(tournament);
  revalidatePath("/admin/tournaments");
  return result;
}

export async function deleteTournamentAction(id: string) {
  await guard();
  const result = await deleteTournament(id);
  revalidatePath("/admin/tournaments");
  return result;
}
