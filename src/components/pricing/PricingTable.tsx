"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlanCard from "./PlanCard";

const features = [
  "Restaurant search & filters",
  "Booking difficulty & method info",
  "AI booking message generation",
  "Saved messages (copy anytime)",
];

const plans = [
  {
    type: "7day" as const,
    name: "7-Day Pass",
    price: "$29",
    duration: "7 days",
    desc: "Best for trips already underway",
  },
  {
    type: "14day" as const,
    name: "14-Day Pass",
    price: "$49",
    duration: "14 days",
    desc: "Most popular — plan ahead with room to spare",
    badge: "MOST POPULAR",
    badgeColor: "primary" as const,
    highlighted: true,
  },
  {
    type: "30day" as const,
    name: "30-Day Pass",
    price: "$79",
    duration: "30 days",
    desc: "Start planning a month out, use through your trip",
    badge: "MOST PEACE OF MIND",
    badgeColor: "gold" as const,
  },
];

export default function PricingTable() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleBuy = async (passType: string) => {
    setLoading(passType);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pass_type: passType }),
      });
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <PlanCard
          key={plan.name}
          name={plan.name}
          price={plan.price}
          duration={plan.duration}
          desc={plan.desc}
          features={features.map((f) => ({ label: f, included: true }))}
          badge={plan.badge}
          badgeColor={plan.badgeColor}
          highlighted={plan.highlighted}
          onBuy={() => handleBuy(plan.type)}
          loading={loading === plan.type}
        />
      ))}
    </div>
  );
}
