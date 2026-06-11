"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { harvestApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { HarvestLog } from "@/app/_lib/types";
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function HarvestPage() {
  const { user } = useAuth();
  const [harvests, setHarvests] = useState<HarvestLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    crop_name: "",
    harvest_date: new Date().toISOString().split("T")[0],
    quantity: "",
    quantity_unit: "",
    notes: "",
  });

  const tier = user?.tier || "free";
  const isPro = tier === "pro" || tier === "plus";
  const limitReached = !isPro && harvests.length >= 10;

  useEffect(() => {
    harvestApi.list()
      .then(setHarvests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (limitReached) return;

    setSubmitting(true);
    setError("");

    try {
      const created = await harvestApi.create({
        crop_name: form.crop_name,
        harvest_date: form.harvest_date,
        quantity: form.quantity ? parseFloat(form.quantity) : undefined,
        quantity_unit: form.quantity_unit || undefined,
        notes: form.notes || undefined,
      });
      setHarvests((prev) => [created, ...prev]);
      setShowForm(false);
      setForm({ crop_name: "", harvest_date: new Date().toISOString().split("T")[0], quantity: "", quantity_unit: "", notes: "" });
    } catch (err: any) {
      if (err.status === 403 && err.message.includes("limit")) {
        setError("Harvest log limit reached. Upgrade to Pro for unlimited entries.");
      } else {
        setError(err.message || "Failed to log harvest");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await harvestApi.delete(id);
      setHarvests((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Harvest Log</h1>
          <p className="text-gray-600">Record your harvests to track your growing success</p>
        </div>
        {!isPro && harvests.length >= 10 && (
          <Link href="/pricing">
            <Button>Upgrade for More</Button>
          </Link>
        )}
      </div>

      {!isPro && harvests.length >= 9 && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-amber-700 text-sm">
            {10 - harvests.length} entries remaining on free plan
          </span>
        </div>
      )}

      {!showForm && !limitReached && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" /> Log a Harvest
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>New Harvest Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Crop Name</Label>
                  <Input
                    value={form.crop_name}
                    onChange={(e) => setForm({ ...form, crop_name: e.target.value })}
                    placeholder="e.g., Cherry Tomatoes"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Harvest Date</Label>
                  <Input
                    type="date"
                    value={form.harvest_date}
                    onChange={(e) => setForm({ ...form, harvest_date: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Quantity (optional)</Label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    placeholder="Amount"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Unit</Label>
                  <Select value={form.quantity_unit} onValueChange={(v) => setForm({ ...form, quantity_unit: v })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lbs">lbs</SelectItem>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                      <SelectItem value="g">g</SelectItem>
                      <SelectItem value="pieces">pieces</SelectItem>
                      <SelectItem value="bunches">bunches</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Notes (optional)</Label>
                  <Input
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any notes about this harvest"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Saving..." : "Save Entry"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Harvest History</CardTitle>
        </CardHeader>
        <CardContent>
          {harvests.length > 0 ? (
            <div className="space-y-3">
              {harvests.map((h) => (
                <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{h.crop_name}</div>
                    <div className="text-sm text-gray-500">{h.harvest_date}</div>
                    {h.quantity && (
                      <div className="text-sm text-gray-600">
                        {h.quantity} {h.quantity_unit}
                      </div>
                    )}
                    {h.notes && (
                      <div className="text-sm text-gray-500 mt-1">{h.notes}</div>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(h.id)}>
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No harvests logged yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}