"use client";

import Button from "@/components/ui/Button";

interface PlanCardProps {
  name: string;
  price: string;
  duration: string;
  features: { label: string; included: boolean }[];
  badge?: string;
  badgeColor?: "primary" | "gold";
  highlighted?: boolean;
  onBuy: () => void;
}

export default function PlanCard({
  name,
  price,
  duration,
  features,
  badge,
  badgeColor = "primary",
  highlighted = false,
  onBuy,
}: PlanCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        highlighted
          ? "border-primary bg-primary/5"
          : "border-dark-600 bg-dark-800"
      }`}
    >
      {badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold ${
          badgeColor === "gold"
            ? "bg-accent-gold text-dark-900"
            : "bg-primary text-white"
        }`}>
          {badge}
        </div>
      )}

      <h3 className="text-lg font-bold text-light-100 mt-1">{name}</h3>
      <div className="mt-2">
        <span className="text-3xl font-bold text-light-100">{price}</span>
      </div>
      <p className="text-sm text-light-300 mt-1">Valid for {duration}</p>

      <ul className="flex flex-col gap-2 mt-5 mb-6 flex-1">
        {features.map((f) => (
          <li key={f.label} className="flex items-center gap-2 text-sm">
            {f.included ? (
              <span className="text-accent-green">&#10003;</span>
            ) : (
              <span className="text-light-300">&#10007;</span>
            )}
            <span className={f.included ? "text-light-200" : "text-light-300"}>{f.label}</span>
          </li>
        ))}
      </ul>

      <Button variant={highlighted ? "primary" : "outline"} onClick={onBuy} className="w-full">
        Buy Now
      </Button>
    </div>
  );
}
