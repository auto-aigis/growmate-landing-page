"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { paymentsApi } from "@/app/_lib/api";
import { useAuth } from "@/app/_components/AuthProvider";
import { Check, Loader2 } from "lucide-react";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Get started with basic features",
    features: [
      "3 crop recommendations",
      "30-day calendar view",
      "5 AI chat messages/month",
      "10 harvest log entries",
      "Basic troubleshooting tips",
    ],
  },
  {
    id: "pro",
    name: "Grower Pro",
    price: "$10.99",
    period: "/month",
    altPrice: "$99/year",
    description: "Everything you need to grow like a pro",
    features: [
      "5-8 crop recommendations",
      "90-day calendar view",
      "Unlimited AI chat",
      "10 photo diagnoses/month",
      "Unlimited harvest log",
      "Companion planting suggestions",
      "Seasonal planting reminders",
    ],
    popular: true,
  },
  {
    id: "plus",
    name: "Grower Plus",
    price: "$18.99",
    period: "/month",
    altPrice: "$169/year",
    description: "Maximum features for serious gardeners",
    features: [
      "Everything in Pro",
      "Unlimited photo diagnoses",
      "Multi-season history",
      "Priority AI responses",
      "Downloadable PDF plans",
      "Early access to features",
      "48-hour email support",
    ],
  },
];

function PricingContent() {
  const { user, refresh } = useAuth();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [paddleLoaded, setPaddleLoaded] = useState(false);

  const tier = user?.tier || "free";
  const isPro = tier === "pro" || tier === "plus";

  useEffect(() => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (clientToken && !(window as any).Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/paddle.js";
      script.async = true;
      script.onload = () => {
        (window as any).Paddle.Environment.set("sandbox");
        (window as any).Paddle.Initialize({ token: clientToken });
        setPaddleLoaded(true);
      };
      document.head.appendChild(script);
    } else if ((window as any).Paddle) {
      setPaddleLoaded(true);
    }
  }, []);

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    if (checkout === "success") {
      refresh();
    }
  }, [searchParams, refresh]);

  const handleSubscribe = async (tierId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    if (tierId === "free" || tierId === tier) return;

    setLoading(tierId);
    setError("");

    try {
      const { price_id, client_token } = await paymentsApi.getCheckoutUrl(
        tierId,
        billing
      );

      if ((window as any).Paddle && paddleLoaded) {
        (window as any).Paddle.Checkout.open({
          items: [{ priceId: price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: "overlay" },
        });
      } else {
        console.error("Paddle not loaded");
        setError("Payment system not ready. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-gray-900">Choose Your Plan</h1>
        <p className="text-gray-600 mt-2">Unlock more features to grow your best harvest</p>
      </div>

      <div className="flex justify-center gap-2 p-1 bg-gray-100 rounded-lg w-fit mx-auto">
        <Button
          variant={billing === "monthly" ? "default" : "ghost"}
          onClick={() => setBilling("monthly")}
          className={billing === "monthly" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Monthly
        </Button>
        <Button
          variant={billing === "annual" ? "default" : "ghost"}
          onClick={() => setBilling("annual")}
          className={billing === "annual" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Annual (Save ~25%)
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => {
          const isCurrentTier = tier === t.id || (tier === "free" && t.id === "free");
          const tierPrice = billing === "annual" && t.altPrice ? t.altPrice : `${t.price}${t.period}`;

          return (
            <Card
              key={t.id}
              className={`relative ${t.popular ? "border-green-500 ring-2 ring-green-500/20" : ""}`}
            >
              {t.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center">
                <CardTitle>{t.name}</CardTitle>
                <div className="text-3xl font-bold mt-2">{tierPrice}</div>
                <CardDescription>{t.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {t.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleSubscribe(t.id)}
                  disabled={isCurrentTier || loading === t.id}
                  className={`w-full mt-6 ${
                    t.popular ? "bg-green-600 hover:bg-green-700" : ""
                  }`}
                  variant={isCurrentTier ? "outline" : t.popular ? "default" : "outline"}
                >
                  {loading === t.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isCurrentTier ? (
                    "Current Plan"
                  ) : (
                    t.id === "free" ? "Get Started" : "Upgrade"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}