const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let msg = `API error: ${res.status}`;
    try {
      const err = await res.json();
      const d = err.detail;
      if (typeof d === "string") msg = d;
      else if (Array.isArray(d)) msg = d.map((e: any) => e.msg).join(", ");
      else if (err.error) msg = err.error;
      else if (err.message) msg = err.message;
    } catch {}
    throw new ApiError(res.status, msg);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiFetch<{ status: string; email: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  login: (email: string, password: string) =>
    apiFetch<import("./types").User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    apiFetch<{ status: string }>("/api/auth/logout", { method: "POST" }),

  me: () => apiFetch<import("./types").User>("/api/auth/me"),

  subscription: () => apiFetch<import("./types").Subscription>("/api/auth/subscription"),

  verifyEmail: (token: string) =>
    apiFetch<{ status: string }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerification: (email: string) =>
    apiFetch<{ status: string }>("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ token: email }),
    }),
};

export const onboardingApi = {
  get: () => apiFetch<import("./types").OnboardingProfile>("/api/onboarding"),

  save: (data: {
    zip_postcode: string;
    space_type: string;
    space_size: string;
    sun_exposure: string;
    container_count: string;
    food_goals: string[];
    experience_level: string;
  }) =>
    apiFetch<import("./types").OnboardingProfile>("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const dashboardApi = {
  getGrowPlan: () =>
    apiFetch<import("./types").GrowPlan>("/api/dashboard/grow-plan"),

  getCalendar: () =>
    apiFetch<import("./types").Calendar>("/api/dashboard/calendar"),
};

export const chatApi = {
  send: (message: string) =>
    apiFetch<import("./types").ChatMessage>("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  history: () => apiFetch<import("./types").ChatMessage[]>("/api/chat/history"),

  usage: () => apiFetch<import("./types").ChatUsage>("/api/chat/usage"),
};

export const diagnoseApi = {
  submit: (imageBase64: string, description?: string) =>
    apiFetch<import("./types").Diagnosis>("/api/diagnose", {
      method: "POST",
      body: JSON.stringify({ image_base64: imageBase64, description }),
    }),

  history: () => apiFetch<import("./types").Diagnosis[]>("/api/diagnose/history"),

  usage: () => apiFetch<import("./types").DiagnosisUsage>("/api/diagnose/usage"),
};

export const harvestApi = {
  list: () => apiFetch<import("./types").HarvestLog[]>("/api/harvest"),

  create: (data: {
    crop_name: string;
    harvest_date: string;
    quantity?: number;
    quantity_unit?: string;
    notes?: string;
  }) =>
    apiFetch<import("./types").HarvestLog>("/api/harvest", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ status: string }>(`/api/harvest/${id}`, { method: "DELETE" }),

  history: () => apiFetch<import("./types").HarvestLog[]>("/api/harvest/history"),
};

export const settingsApi = {
  get: () => apiFetch<import("./types").Settings>("/api/settings"),

  save: (openaiApiKey?: string) =>
    apiFetch<{ status: string }>("/api/settings", {
      method: "POST",
      body: JSON.stringify({ openai_api_key: openaiApiKey }),
    }),
};

export const paymentsApi = {
  getCheckoutUrl: (tier: string, billingInterval: string) =>
    apiFetch<import("./types").CheckoutInfo>("/api/payments/checkout-url", {
      method: "POST",
      body: JSON.stringify({ tier, billing_interval: billingInterval }),
    }),
};