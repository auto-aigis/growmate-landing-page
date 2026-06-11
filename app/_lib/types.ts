export interface User {
  id: string;
  email: string;
  display_name: string | null;
  tier: 'free' | 'pro' | 'plus';
  onboarding_completed: boolean;
  created_at: string;
}

export interface Subscription {
  tier: string;
  status: string;
  plan_interval: string | null;
  current_period_end: string | null;
}

export interface OnboardingProfile {
  zip_postcode: string;
  hardiness_zone: string;
  frost_dates: { last_frost: string; first_frost: string };
  current_season: string;
  space_type: string;
  space_size: string;
  sun_exposure: string;
  container_count: string;
  food_goals: string[];
  experience_level: string;
}

export interface Crop {
  name: string;
  why_it_suits: string;
  planting_window: string;
  days_to_harvest: number;
  companion_planting?: string[];
}

export interface GrowPlan {
  crops: Crop[];
}

export interface CalendarEvent {
  date: string;
  crop_name: string;
  action: string;
}

export interface Calendar {
  events: CalendarEvent[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatUsage {
  used: number;
  limit: number;
}

export interface Diagnosis {
  id: string;
  identified_issue: string;
  root_cause: string;
  action_steps: string[];
  followup_prompt: string;
  created_at: string;
}

export interface DiagnosisUsage {
  used: number;
  limit: number;
}

export interface HarvestLog {
  id: string;
  crop_name: string;
  harvest_date: string;
  quantity?: number;
  quantity_unit?: string;
  notes?: string;
  season_year?: number;
}

export interface Settings {
  openai_api_key_masked: string | null;
}

export interface CheckoutInfo {
  price_id: string;
  client_token: string;
}