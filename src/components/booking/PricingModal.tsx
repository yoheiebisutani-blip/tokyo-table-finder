"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const plans = [
  { type: "7day" as const, label: "7-Day Pass", price: "$29" },
  { type: "14day" as const, label: "14-Day Pass", price: "$49", popular: true },
  { type: "30day" as const, label: "30-Day Pass", price: "$79", best: true },
];

export default function PricingModal({ isOpen, onClose }: PricingModalProps) {
  const params = useParams();
  const restaurantId = params?.id as string | undefined;
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (passType: string) => {
    setLoading(passType);
    try {
      const body: Record<string, string> = {
        pass_type: passType,
        redirect_to: restaurantId ? `/generate/${restaurantId}` : "/search",
      };
      if (passType === "single" && restaurantId) {
        body.restaurant_id = restaurantId;
      }
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch {
      alert("Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Unlock Booking Messages">
      <div className="flex flex-col gap-3 mt-2">
        {plans.map((plan) => (
          <button
            key={plan.type}
            onClick={() => handleCheckout(plan.type)}
            disabled={!!loading}
            className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
              plan.popular
                ? "border-primary bg-primary/10"
                : "border-dark-600 hover:border-light-300"
            } disabled:opacity-50`}
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-light-100">{plan.label}</span>
                {plan.popular && <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">POPULAR</span>}
                {plan.best && <span className="text-xs bg-accent-gold text-dark-900 px-2 py-0.5 rounded-full">BEST VALUE</span>}
              </div>
              <span className="text-sm text-light-300">Unlimited messages</span>
            </div>
            <span className="text-xl font-bold text-light-100">
              {loading === plan.type ? "..." : plan.price}
            </span>
          </button>
        ))}

      </div>
    </Modal>
  );
}
