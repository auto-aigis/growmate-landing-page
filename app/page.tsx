"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Leaf,
  MessageCircle,
  Calendar,
  MapPin,
  Sun,
  Sprout,
  ArrowRight,
  Check,
  Menu,
  X,
} from "lucide-react";

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  badge?: string;
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <MapPin className="h-6 w-6 text-green-600" />,
      title: "Space-Aware Planning",
      description:
        "Tell GrowMate about your balcony, containers, or raised beds and get a grow plan perfectly tailored to your exact space constraints.",
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      title: "AI Chat Coach",
      description:
        "Ask questions like \"why are my tomato leaves yellowing?\" and get instant, context-aware answers based on your specific setup and location.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-green-600" />,
      title: "Seasonal Harvest Calendar",
      description:
        "A succession planting calendar customized to your microclimate ensures you always have something ready to harvest.",
    },
    {
      icon: <Sun className="h-6 w-6 text-green-600" />,
      title: "Microclimate Intelligence",
      description:
        "GrowMate factors in your sun exposure, wind patterns, and local weather data to recommend the best crops for your exact conditions.",
    },
    {
      icon: <Sprout className="h-6 w-6 text-green-600" />,
      title: "Companion Planting",
      description:
        "Maximize your limited space with AI-optimized companion planting suggestions that boost yields and deter pests naturally.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "Food Preference Matching",
      description:
        "Only grow what you actually want to eat. GrowMate prioritizes crops based on your dietary preferences and cooking habits.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Describe Your Space",
      description:
        "Enter your location, available growing area, container sizes, and sun exposure. GrowMate builds your growing profile.",
    },
    {
      number: "02",
      title: "Get Your Grow Plan",
      description:
        "Receive a personalized seasonal plan with companion planting, spacing guides, and a succession harvest calendar.",
    },
    {
      number: "03",
      title: "Chat & Grow",
      description:
        "Ask your AI coach anything as you grow. Get real-time troubleshooting, care reminders, and harvest tips.",
    },
  ];

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with one growing space",
      features: [
        "1 growing space profile",
        "Basic seasonal calendar",
        "5 AI chat questions/month",
        "Community forum access",
      ],
      highlighted: false,
    },
    {
      name: "Grower",
      price: "$9",
      period: "/month",
      description: "For dedicated balcony and container gardeners",
      features: [
        "Up to 5 growing spaces",
        "Full succession calendar",
        "Unlimited AI chat",
        "Companion planting optimizer",
        "Pest & disease diagnosis",
        "Weekly care reminders",
      ],
      highlighted: true,
      badge: "Most Popular",
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For urban farming enthusiasts and community gardens",
      features: [
        "Unlimited growing spaces",
        "Advanced yield forecasting",
        "Unlimited AI chat",
        "Multi-season planning",
        "Seed-to-harvest tracking",
        "Priority support",
        "API access",
      ],
      highlighted: false,
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "Do I need gardening experience to use GrowMate?",
      answer:
        "Not at all! GrowMate is designed for complete beginners. Just tell us about your space and food preferences, and our AI will guide you through every step from seed to harvest.",
    },
    {
      question: "How does GrowMate know what works in my location?",
      answer:
        "GrowMate uses your location data combined with historical climate information, frost dates, and real-time weather to provide hyper-local growing recommendations tailored to your exact microclimate.",
    },
    {
      question: "Can I use GrowMate for indoor growing?",
      answer:
        "Yes! GrowMate supports indoor growing setups including windowsills, grow lights, and indoor hydroponic systems. Just specify your indoor conditions when setting up your space.",
    },
    {
      question: "What makes GrowMate different from other gardening apps?",
      answer:
        "GrowMate is the only AI-native web tool that combines space-aware planning, conversational coaching, and location-specific calendars in one platform. Other apps are generic or static — GrowMate gives personalized, context-aware advice for your exact setup.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Absolutely. You can cancel your subscription at any time with no penalties. Your data and grow plans remain accessible on the free tier.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Leaf className="h-7 w-7 text-green-600" />
              <span className="text-xl font-bold text-gray-900">GrowMate</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" asChild>
                <a href="/login">Sign In</a>
              </Button>
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <a href="/register">Get Started</a>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <div className="flex flex-col gap-2 pt-2">
                <Button variant="outline" asChild>
                  <a href="/login">Sign In</a>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                  <a href="/register">Get Started</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium">
            🌱 AI-Powered Urban Gardening
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Your AI Grow Coach for Balcony {"&"} Small-Space Food Gardens
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            GrowMate generates personalized grow plans, companion planting guides, and seasonal harvest calendars — all
            tailored to your exact space, location, and food preferences. Ask it anything.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
              <a href="/register">
                Start Growing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required. Free tier available forever.</p>

          {/* Hero visual */}
          <div className="mt-16 max-w-4xl mx-auto rounded-2xl border border-gray-200 bg-gradient-to-br from-green-50 to-emerald-50 p-8 sm:p-12 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <MapPin className="h-8 w-8 text-green-600 mb-3" />
                <p className="font-semibold text-gray-900 text-sm">Brooklyn, NY</p>
                <p className="text-xs text-gray-500 mt-1">South-facing balcony, 3 containers</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <Calendar className="h-8 w-8 text-green-600 mb-3" />
                <p className="font-semibold text-gray-900 text-sm">Spring Plan Ready</p>
                <p className="text-xs text-gray-500 mt-1">Tomatoes, basil, peppers, lettuce</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                <MessageCircle className="h-8 w-8 text-green-600 mb-3" />
                <p className="font-semibold text-gray-900 text-sm">{"\"Why are my leaves curling?\""}</p>
                <p className="text-xs text-gray-500 mt-1">Likely heat stress — try afternoon shade</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Grow Food in Small Spaces
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              GrowMate combines AI intelligence with gardening expertise to give you personalized,
              space-aware growing guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From Setup to Harvest in 3 Simple Steps
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              GrowMate makes urban food growing effortless, even if you{"'"}ve never planted a seed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-700 font-bold text-xl mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Plans That Grow With You
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you{"'"}re ready for more. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative ${
                  tier.highlighted
                    ? "border-green-600 border-2 shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-600 text-white">{tier.badge}</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-500 ml-1">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                    asChild
                  >
                    <a href="/register">
                      {tier.price === "$0" ? "Start Free" : "Get Started"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Own Food?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of urban gardeners already growing fresh food on their balconies
            and small spaces with AI-powered guidance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-6">
              <a href="/register">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <a href="/login">Sign In</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-500" />
              <span className="text-lg font-bold text-white">GrowMate</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                FAQ
              </a>
              <a href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </a>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <p className="text-center text-sm text-gray-500">
            © 2024 GrowMate. All rights reserved. Grow food, not lawns.
          </p>
        </div>
      </footer>
    </div>
  );
}