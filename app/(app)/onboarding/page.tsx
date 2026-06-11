"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { onboardingApi, authApi } from "@/app/_lib/api";

const FOOD_GOALS = [
  "Fresh salad greens",
  "Herbs for cooking",
  "Cherry tomatoes",
  "Peppers & chilies",
  "Edible flowers",
  "Microgreens",
  "Low-maintenance herbs",
  "Year-round harvests",
];

const SPACE_SIZES = [
  { value: "under_10", label: "Under 10 sq ft" },
  { value: "10_30", label: "10–30 sq ft" },
  { value: "30_60", label: "30–60 sq ft" },
  { value: "60_100", label: "60–100 sq ft" },
  { value: "100_plus", label: "100+ sq ft" },
];

const CONTAINER_COUNTS = [
  { value: "1_3", label: "1–3 containers" },
  { value: "4_8", label: "4–8 containers" },
  { value: "9_15", label: "9–15 containers" },
  { value: "15_plus", label: "15+ containers" },
];

const STEPS = ["Location", "Space", "Goals", "Experience"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    zip_postcode: "",
    space_type: "",
    space_size: "",
    sun_exposure: "",
    container_count: "",
    food_goals: [] as string[],
    experience_level: "",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFoodGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      food_goals: prev.food_goals.includes(goal)
        ? prev.food_goals.filter((g) => g !== goal)
        : [...prev.food_goals, goal],
    }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await onboardingApi.save(formData);
      await authApi.me();
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return formData.zip_postcode.length >= 4;
      case 1:
        return formData.space_type && formData.space_size && formData.sun_exposure;
      case 2:
        return formData.food_goals.length > 0;
      case 3:
        return formData.experience_level;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="zip" className="text-base">ZIP/Postcode</Label>
              <Input
                id="zip"
                value={formData.zip_postcode}
                onChange={(e) => updateField("zip_postcode", e.target.value)}
                placeholder="e.g., 10001 or SW1A"
                className="mt-2"
              />
              <p className="text-sm text-gray-500 mt-2">
                We&apos;ll use this to find your hardiness zone and frost dates.
              </p>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">Space Type</Label>
              <Select value={formData.space_type} onValueChange={(v) => updateField("space_type", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your space" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balcony">Balcony</SelectItem>
                  <SelectItem value="patio">Patio</SelectItem>
                  <SelectItem value="windowsill">Windowsill</SelectItem>
                  <SelectItem value="indoor">Indoor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base">Space Size</Label>
              <Select value={formData.space_size} onValueChange={(v) => updateField("space_size", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {SPACE_SIZES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base">Sun Exposure</Label>
              <Select value={formData.sun_exposure} onValueChange={(v) => updateField("sun_exposure", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select sun exposure" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_sun">Full sun (6+ hours)</SelectItem>
                  <SelectItem value="partial_sun">Partial sun (3–6 hours)</SelectItem>
                  <SelectItem value="shade">Shade (under 3 hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base">Containers</Label>
              <Select value={formData.container_count} onValueChange={(v) => updateField("container_count", v)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Number of containers" />
                </SelectTrigger>
                <SelectContent>
                  {CONTAINER_COUNTS.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select all that interest you:</p>
            <div className="grid grid-cols-2 gap-3">
              {FOOD_GOALS.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.food_goals.includes(goal)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={formData.food_goals.includes(goal)}
                    onCheckedChange={() => toggleFoodGoal(goal)}
                  />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">How much gardening experience do you have?</p>
            <div className="space-y-2">
              {[
                { value: "beginner", label: "Beginner", desc: "First time growing" },
                { value: "some_experience", label: "Some experience", desc: "1–3 seasons" },
                { value: "experienced", label: "Experienced", desc: "3+ seasons" },
              ].map((exp) => (
                <label
                  key={exp.value}
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.experience_level === exp.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="experience"
                    value={exp.value}
                    checked={formData.experience_level === exp.value}
                    onChange={(e) => updateField("experience_level", e.target.value)}
                    className="w-4 h-4 text-green-600"
                  />
                  <div>
                    <div className="font-medium">{exp.label}</div>
                    <div className="text-sm text-gray-500">{exp.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Welcome to GrowMate</CardTitle>
          <CardDescription>Let&apos;s personalize your growing experience</CardDescription>
          <div className="flex gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-green-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
          )}
          {renderStep()}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleBack} disabled={step === 0}>
              Back
            </Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={handleNext} disabled={!canProceed()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={!canProceed() || loading}>
                {loading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}