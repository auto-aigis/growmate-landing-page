"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { diagnoseApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { Diagnosis, DiagnosisUsage } from "@/app/_lib/types";
import { Loader2, Upload, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

function DiagnoseContent() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Diagnosis | null>(null);
  const [usage, setUsage] = useState<DiagnosisUsage | null>(null);
  const [error, setError] = useState("");

  const tier = user?.tier || "free";
  const isPro = tier === "pro" || tier === "plus";
  const isPlus = tier === "plus";

  useEffect(() => {
    if (isPro) {
      diagnoseApi.usage()
        .then(setUsage)
        .catch(console.error);
    }
  }, [isPro]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        try {
          const diagnosis = await diagnoseApi.submit(base64, description);
          setResult(diagnosis);
          if (usage) {
            setUsage({ used: usage.used + 1, limit: usage.limit });
          }
        } catch (err: any) {
          setError(err.message || "Diagnosis failed");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setError("Failed to process image");
      setLoading(false);
    }
  };

  if (!isPro) {
    return (
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Plant Photo Diagnosis</h1>
        <p className="text-gray-600 mb-6">Upload a photo of your plant problem for AI-powered diagnosis</p>
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pro Feature</h3>
            <p className="text-gray-600 mb-4">Photo diagnosis is available on Grower Pro and Grower Plus plans.</p>
            <Link href="/pricing">
              <Button className="bg-green-600 hover:bg-green-700">Upgrade to Pro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const limitReached = !isPlus && usage && usage.used >= usage.limit;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Plant Photo Diagnosis</h1>
        <p className="text-gray-600">Upload a photo and get AI-powered diagnosis</p>
      </div>

      {usage && !isPlus && (
        <div className={`p-3 rounded-lg ${limitReached ? "bg-amber-50 border border-amber-200" : "bg-green-50 border border-green-200"}`}>
          <span className={limitReached ? "text-amber-700" : "text-green-700"}>
            {limitReached
              ? "You've reached your monthly diagnosis limit"
              : `${usage.used} of ${usage.limit} diagnoses used this month`}
          </span>
          {limitReached && isPlus && (
            <Link href="/pricing" className="ml-2">
              <Button size="sm" variant="outline">Upgrade to Plus</Button>
            </Link>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload Photo</CardTitle>
          <CardDescription>Take a clear photo of the affected plant part</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => { setFile(null); setPreview(null); }}
              >
                ✕
              </Button>
            </div>
          )}
          {!preview && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <span className="text-green-600 hover:underline">Click to upload</span> or drag and drop
              </label>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Leaves turning yellow at the bottom"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!file || loading || limitReached}
            className="w-full"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
            ) : (
              "Get Diagnosis"
            )}
          </Button>
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Diagnosis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Identified Issue</h4>
              <p className="text-gray-700">{result.identified_issue}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Root Cause</h4>
              <p className="text-gray-700">{result.root_cause}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Next Steps</h4>
              <ul className="list-disc list-inside space-y-1">
                {result.action_steps.map((step, i) => (
                  <li key={i} className="text-gray-700">{step}</li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">{result.followup_prompt}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <DiagnoseContent />
    </Suspense>
  );
}