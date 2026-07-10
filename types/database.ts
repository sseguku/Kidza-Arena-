export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type BookingType = "individual" | "team";
export type BookingStatus = "pending_approval" | "confirmed" | "cancelled";
export type PaymentStatus = "unpaid" | "paid" | "refunded";
export type SessionPeriod = "day" | "night";
export type UserRole = "user" | "admin";
export type TournamentStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type MediaType = "image" | "video";

export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          created_at: string;
          booking_type: BookingType;
          booking_date: string;
          start_time: string;
          duration_hours: number;
          price_ugx: number;
          session_period: SessionPeriod;
          full_name: string;
          phone: string;
          email: string;
          whatsapp: string | null;
          preferred_contact: string | null;
          player_count: number | null;
          skill_level: string | null;
          match_type: string | null;
          team_name: string | null;
          notes: string | null;
          status: BookingStatus;
          payment_status: PaymentStatus;
        };
        Insert: {
          id?: string;
          created_at?: string;
          booking_type: BookingType;
          booking_date: string;
          start_time: string;
          duration_hours: number;
          price_ugx: number;
          session_period: SessionPeriod;
          full_name: string;
          phone: string;
          email: string;
          whatsapp?: string | null;
          preferred_contact?: string | null;
          player_count?: number | null;
          skill_level?: string | null;
          match_type?: string | null;
          team_name?: string | null;
          notes?: string | null;
          status?: BookingStatus;
          payment_status?: PaymentStatus;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]>;
        Relationships: [];
      };
      media_assets: {
        Row: {
          id: string;
          title: string;
          url: string;
          type: MediaType;
          category: string | null;
          alt_text: string | null;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          type?: MediaType;
          category?: string | null;
          alt_text?: string | null;
          sort_order?: number;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]>;
        Relationships: [];
      };
      academy_programs: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          age_group: string | null;
          schedule: string | null;
          price_ugx: number | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          age_group?: string | null;
          schedule?: string | null;
          price_ugx?: number | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["academy_programs"]["Insert"]>;
        Relationships: [];
      };
      tournaments: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string | null;
          end_date: string | null;
          format: string | null;
          prize_ugx: number | null;
          status: TournamentStatus;
          max_teams: number | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date?: string | null;
          end_date?: string | null;
          format?: string | null;
          prize_ugx?: number | null;
          status?: TournamentStatus;
          max_teams?: number | null;
          is_published?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tournaments"]["Insert"]>;
        Relationships: [];
      };
      recurring_bookings: {
        Row: {
          id: string;
          team_name: string;
          booking_type: BookingType;
          day_of_week: number;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          recurrence_type: string;
          active: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_name: string;
          booking_type?: BookingType;
          day_of_week: number;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          recurrence_type?: string;
          active?: boolean;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recurring_bookings"]["Insert"]>;
        Relationships: [];
      };
      blocked_slots: {
        Row: {
          id: string;
          block_date: string | null;
          day_of_week: number | null;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          reason: string | null;
          is_recurring: boolean;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          block_date?: string | null;
          day_of_week?: number | null;
          start_time: string;
          end_time: string;
          duration_minutes: number;
          reason?: string | null;
          is_recurring?: boolean;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["blocked_slots"]["Insert"]>;
        Relationships: [];
      };
      recurring_overrides: {
        Row: {
          id: string;
          recurring_booking_id: string;
          override_date: string;
          action: string;
          new_start_time: string | null;
          new_end_time: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          recurring_booking_id: string;
          override_date: string;
          action?: string;
          new_start_time?: string | null;
          new_end_time?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["recurring_overrides"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
