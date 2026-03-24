"use client";

import { useRouter } from "next/navigation";
import PlanCard from "./PlanCard";

const features = [
  "AI Recommendations",
  "Booking Messages",
  "Hard-to-Book Playbook",
  "Hidden Gems List",
];

const plans = [
  {
    name: "7-Day Pass",
    price: "$19",
    duration: "7 days",
    included: [true, true, false, false],
  },
  {
    name: "14-Day Pass",
    price: "$29",
    duration: "14 days",
    included: [true, true, false, false],
    badge: "MOST POPULAR",
    badgeColor: "primary" as const,
    highlighted: true,
  },
  {
    name: "30-Day Pass",
    price: "$39",
    duration: "30 days",
    included: [true, true, true, true],
    badge: "BEST VALUE",
    badgeColor: "gold" as const,
  },
];

export default function PricingTable() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <PlanCard
          key={plan.name}
          name={plan.name}
          price={plan.price}
          duration={plan.duration}
          features={features.map((f, i) => ({ label: f, included: plan.included[i] }))}
          badge={plan.badge}
          badgeColor={plan.badgeColor}
          highlighted={plan.highlighted}
          onBuy={() => router.push("/pricing")}
        />
      ))}
    </div>
  );
}
