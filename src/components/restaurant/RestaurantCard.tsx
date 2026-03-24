"use client";

import { useRouter } from "next/navigation";
import type { Restaurant } from "@/lib/mock-data";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import DifficultyBadge from "./DifficultyBadge";
import CuisineBadge from "./CuisineBadge";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const router = useRouter();

  const budgetLabel =
    restaurant.budget_min >= 20000
      ? "¥20,000+"
      : restaurant.budget_min >= 10000
        ? "¥10,000-¥20,000"
        : restaurant.budget_min >= 5000
          ? "¥5,000-¥10,000"
          : restaurant.budget_min >= 3000
            ? "¥3,000-¥5,000"
            : "Under ¥3,000";

  return (
    <Card
      onClick={() => router.push(`/restaurant/${restaurant.id}`)}
      className="flex flex-col gap-3"
    >
      {/* Image placeholder */}
      <div className="w-full h-40 bg-dark-700 rounded-lg flex items-center justify-center">
        <span className="text-light-300 text-sm">{restaurant.cuisine_display_en}</span>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <h3 className="text-lg font-semibold text-light-100">
            {restaurant.name_en}
          </h3>
          <p className="text-sm text-light-300">{restaurant.name_ja}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CuisineBadge cuisine={restaurant.cuisine_display_en} />
          <Badge>{restaurant.area_display_en}</Badge>
          <Badge>{budgetLabel}</Badge>
        </div>

        <div className="flex items-center justify-between">
          <DifficultyBadge level={restaurant.difficulty} showLabel />
          {restaurant.english_support && (
            <Badge variant="green">EN OK</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}
