"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRestaurantById } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import DifficultyBadge from "@/components/restaurant/DifficultyBadge";
import CuisineBadge from "@/components/restaurant/CuisineBadge";
import Link from "next/link";

const FREE_LIMIT = 3;
const STORAGE_KEY = "ttf_viewed_restaurants";

function getViewedIds(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function recordView(id: string) {
  const viewed = getViewedIds();
  if (!viewed.includes(id)) {
    viewed.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));
  }
}

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [isLocked, setIsLocked] = useState(false);
  const restaurant = getRestaurantById(id);

  useEffect(() => {
    if (isLoggedIn) return;
    const viewed = getViewedIds();
    const isNew = !viewed.includes(id);
    if (isNew && viewed.length >= FREE_LIMIT) {
      setIsLocked(true);
    } else {
      recordView(id);
    }
  }, [id, isLoggedIn]);

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-light-100 mb-4">Restaurant not found</h1>
        <Button onClick={() => router.push("/search")}>Back to Search</Button>
      </div>
    );
  }

  const difficultyLabels = ["Very Easy", "Easy", "Moderate", "Hard", "Very Hard"];
  const stars = Array.from({ length: 5 }, (_, i) => (i < restaurant.difficulty ? "★" : "☆")).join("");

  if (isLocked) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="text-light-300 hover:text-light-100 text-sm mb-4 inline-flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>

        {/* Restaurant name visible */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-light-100">{restaurant.name_en}</h1>
          <p className="text-lg text-light-300 mt-1">{restaurant.name_ja}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <CuisineBadge cuisine={restaurant.cuisine_display_en} />
            <Badge>{restaurant.area_display_en}</Badge>
          </div>
        </div>

        {/* Register wall */}
        <div className="border border-primary/40 bg-primary/5 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-light-100 mb-3">
            Sign up free to see booking details
          </h2>
          <p className="text-light-300 mb-6 max-w-md mx-auto">
            You&apos;ve viewed {FREE_LIMIT} restaurants. Create a free account to keep browsing — booking difficulty, reservation methods, and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/login?redirect=/restaurant/${id}`}>
              <Button size="lg">Create Free Account</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Log In</Button>
            </Link>
          </div>
          <p className="text-xs text-light-300 mt-4">No credit card required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="text-light-300 hover:text-light-100 text-sm mb-4 inline-flex items-center gap-1 transition-colors">
        ← Back
      </button>

      {/* Image placeholder */}
      <div className="w-full h-48 md:h-64 bg-dark-800 border border-dark-600 rounded-xl flex items-center justify-center mb-6">
        <span className="text-light-300">{restaurant.cuisine_display_en} Restaurant</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-light-100">{restaurant.name_en}</h1>
          <p className="text-lg text-light-300 mt-1">{restaurant.name_ja}</p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <CuisineBadge cuisine={restaurant.cuisine_display_en} />
        <Badge>{restaurant.area_display_en}</Badge>
        <Badge>¥{restaurant.budget_min.toLocaleString()} - ¥{restaurant.budget_max.toLocaleString()}</Badge>
        {restaurant.english_support && <Badge variant="green">English OK</Badge>}
        {restaurant.has_counter && <Badge>Counter</Badge>}
        {restaurant.has_private_room && <Badge>Private Room</Badge>}
        {restaurant.tags.map((tag) => (
          <Badge key={tag} variant="gold">{tag}</Badge>
        ))}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm text-light-300 mb-1">Booking Difficulty</h3>
            <div className="flex items-center gap-2">
              <span className="text-primary">{stars}</span>
              <span className="text-light-200 text-sm">{difficultyLabels[restaurant.difficulty - 1]}</span>
            </div>
            <DifficultyBadge level={restaurant.difficulty} />
          </div>

          <div>
            <h3 className="text-sm text-light-300 mb-1">Best Way to Book</h3>
            <p className="text-light-100 capitalize">{restaurant.booking_method}</p>
          </div>

          <div>
            <h3 className="text-sm text-light-300 mb-1">English Support</h3>
            <p className="text-light-100">{restaurant.english_support ? "Yes" : "Limited / None"}</p>
          </div>

          <div>
            <h3 className="text-sm text-light-300 mb-1">Available</h3>
            <p className="text-light-100">
              {[restaurant.lunch_available && "Lunch", restaurant.dinner_available && "Dinner"].filter(Boolean).join(" & ")}
            </p>
          </div>
        </div>

        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-sm text-light-300 mb-1">Address</h3>
            <p className="text-light-100">{restaurant.address_en}</p>
            <p className="text-light-300 text-sm">{restaurant.address_ja}</p>
          </div>

          {restaurant.google_maps_url && (
            <a
              href={restaurant.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover text-sm transition-colors"
            >
              Open in Google Maps →
            </a>
          )}

          {restaurant.phone && (
            <div>
              <h3 className="text-sm text-light-300 mb-1">Phone</h3>
              <p className="text-light-100">{restaurant.phone}</p>
            </div>
          )}

          {restaurant.email && (
            <div>
              <h3 className="text-sm text-light-300 mb-1">Email</h3>
              <p className="text-light-100">{restaurant.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-light-100 mb-3">About</h2>
        <p className="text-light-200 leading-relaxed">{restaurant.description_en}</p>
      </div>

      {/* Booking Tips */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-light-100 mb-3">Booking Tips</h2>
        <p className="text-light-200 leading-relaxed">{restaurant.booking_tips_en}</p>
      </div>

      {/* CTA */}
      <div className="sticky bottom-4 z-10">
        <Button
          size="lg"
          className="w-full shadow-lg shadow-primary/20"
          onClick={() => router.push(`/generate/${restaurant.id}`)}
        >
          Generate Booking Message
        </Button>
      </div>
    </div>
  );
}
