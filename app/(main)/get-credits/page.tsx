"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Star } from "lucide-react";
import { useStripeMode } from "@/lib/hooks";
import { getStripePriceId } from "@/lib/stripe-config";

const plans = [
  {
    name: "Basic",
    price: 99,
    credits: 1000,
    features: [
      "1,000 AI image generations per month",
      "Standard resolution outputs",
      "Basic style presets",
      "Email support",
      "API access",
    ],
    icon: Sparkles,
    popular: false,
  },
  {
    name: "Pro",
    price: 299,
    credits: 5000,
    features: [
      "5,000 AI image generations per month",
      "High resolution outputs",
      "Advanced style presets",
      "Priority support",
      "API access with higher rate limits",
      "Custom model fine-tuning",
      "Team collaboration features",
    ],
    icon: Zap,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    credits: "Unlimited",
    features: [
      "Unlimited AI image generations",
      "Custom resolution outputs",
      "Custom style presets",
      "24/7 dedicated support",
      "Custom API integration",
      "Custom model training",
      "Advanced team management",
      "SLA guarantees",
    ],
    icon: Star,
    popular: false,
  },
];

export default function GetCreditsPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { mode } = useStripeMode();

  const handleSubscribe = async (plan: typeof plans[0]) => {
    setLoading(true);
    try {
      if (plan.name === "Enterprise") {
        // Redirect to contact form or open modal
        router.push("/contact");
        return;
      }

      const priceId = plan.name === "Basic" 
        ? getStripePriceId(mode, "one")
        : getStripePriceId(mode, "three");

      if (!priceId) {
        throw new Error("Price ID not found");
      }

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          credits: plan.credits,
          mode,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choose Your Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your image generation needs. All plans include our core AI features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative ${plan.popular ? 'border-primary' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <plan.icon className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">
                  {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                </span>
                {typeof plan.price === 'number' && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </div>
              <CardDescription>
                {typeof plan.credits === 'number' 
                  ? `${plan.credits.toLocaleString()} credits per month`
                  : plan.credits}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={() => handleSubscribe(plan)}
                disabled={loading}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Need a custom plan?{" "}
          <Button variant="link" onClick={() => router.push("/contact")}>
            Contact our sales team
          </Button>
        </p>
      </div>
    </div>
  );
}
