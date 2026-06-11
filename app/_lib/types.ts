export interface User {
  id: string;
  email: string;
  name: string;
  subscription_tier: string | null;
  subscription_status: string | null;
}

export interface Plant {
  id: string;
  name: string;
  variety: string;
  planting_date: string;
  status: string;
  image_url?: string;
}

export interface Diagnosis {
  id: string;
  plant_id: string;
  diagnosis_type: string;
  result: string;
  confidence: number;
  created_at: string;
}

export interface HarvestRecord {
  id: string;
  plant_id: string;
  amount: number;
  unit: string;
  harvested_at: string;
  quality_grade: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatUsage {
  used: number;
  limit: number;
}

export interface GrowPlan {
  crops: Array<{
    name: string;
    why_it_suits: string;
    days_to_harvest: number;
    planting_window: string;
    companion_planting?: string[];
  }>;
}

export interface Calendar {
  events: Array<{
    date: string;
    crop_name: string;
    action: string;
  }>;
}

export interface HarvestLog {
  id: string;
  crop_name: string;
  harvest_date: string;
  quantity?: number;
  quantity_unit?: string;
}

export interface Subscription {
  tier: string;
  status: string;
}

export interface DiagnosisUsage {
  used: number;
  limit: number;
}