"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardApi, harvestApi, authApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import type { GrowPlan, Calendar, HarvestLog, OnboardingProfile, Subscription } from "@/app/_lib/types";
import { MessageCircle, Camera, CalendarDays, Leaf, ArrowRight, Loader2 } from "lucide-react";

function DashboardContent() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [growPlan, setGrowPlan] = useState<GrowPlan | null>(null);
  const [calendar, setCalendar] = useState<Calendar | null>(null);
  const [harvests, setHarvests] = useState<HarvestLog[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    const checkoutSuccess = searchParams.get("checkout") === "success";
    const transactionId = searchParams.get("transaction_id");

    if (checkoutSuccess && transactionId) {
      setProcessingPayment(true);
      const interval = setInterval(async () => {
        try {
          const sub = await authApi.subscription();
          setSubscription(sub);
          if (sub.tier !== "free") {
            clearInterval(interval);
            setProcessingPayment(false);
            refresh();
            router.replace("/dashboard");
          }
        } catch {}
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [searchParams, refresh, router]);

  useEffect(() => {
    async function load() {
      try {
        const [plan, cal, harv, sub] = await Promise.all([
          dashboardApi.getGrowPlan(),
          dashboardApi.getCalendar(),
          harvestApi.list(),
          authApi.subscription(),
        ]);
        setGrowPlan(plan);
        setCalendar(cal);
        setHarvests(harv);
        setSubscription(sub);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const tier = user?.tier || "free";
  const isPro = tier === "pro" || tier === "plus";
  const calendarDays = isPro ? 90 : 30;

  return (
    <div className="space-y-6">
      {processingPayment && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-green-600" />
          <span className="text-green-800">Processing payment... please wait.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Grow Plan</h1>
          <p className="text-gray-600">Personalized crops for your space and season</p>
        </div>
        {tier === "free" && (
          <Link href="/pricing">
            <Button>Upgrade to Pro</Button>
          </Link>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/chat" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-green-200 hover:border-green-400">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Ask Coach</h3>
                <p className="text-sm text-gray-500">Get plant advice</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/diagnose" className="block">
          <Card className={`h-full hover:shadow-md transition-shadow cursor-pointer ${isPro ? "border-green-200 hover:border-green-400" : "opacity-60"}`}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Diagnose</h3>
                <p className="text-sm text-gray-500">{isPro ? "Photo diagnosis" : "Pro feature"}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/harvest" className="block">
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-green-200 hover:border-green-400">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Harvest Log</h3>
                <p className="text-sm text-gray-500">Record your harvests</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Recommended Crops
            </CardTitle>
            <CardDescription>Best choices for your space</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {growPlan?.crops.map((crop, idx) => (
              <div key={idx} className="p-4 border rounded-lg hover:border-green-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{crop.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{crop.why_it_suits}</p>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-200">
                    {crop.days_to_harvest} days
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Plant:</span> {crop.planting_window}
                </p>
                {crop.companion_planting && crop.companion_planting.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Pairs well with:</span> {crop.companion_planting.join(", ")}
                  </p>
                )}
              </div>
            ))}
            {!growPlan?.crops.length && (
              <p className="text-gray-500 text-center py-4">Complete onboarding to see recommendations</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              {calendarDays}-Day Calendar
            </CardTitle>
            <CardDescription>What to plant and when</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {calendar?.events.slice(0, 20).map((event, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 text-sm">
                  <span className="w-24 text-gray-500 font-medium">{event.date}</span>
                  <span className="text-gray-900">{event.crop_name}</span>
                  <Badge variant="secondary" className="text-xs">{event.action}</Badge>
                </div>
              ))}
              {!calendar?.events.length && (
                <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Harvests</CardTitle>
          <CardDescription>Your logged harvests</CardDescription>
        </CardHeader>
        <CardContent>
          {harvests.length > 0 ? (
            <div className="space-y-2">
              {harvests.slice(0, 5).map((h) => (
                <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900">{h.crop_name}</span>
                    <span className="text-sm text-gray-500 ml-2">{h.harvest_date}</span>
                  </div>
                  {h.quantity && (
                    <Badge variant="outline">{h.quantity} {h.quantity_unit}</Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No harvests logged yet</p>
          )}
          <Link href="/harvest" className="mt-4 block">
            <Button variant="outline" className="w-full">
              View All Harvests <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}