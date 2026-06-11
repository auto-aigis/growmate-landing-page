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
