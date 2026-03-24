"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { getRestaurantById, generateMockMessage } from "@/lib/mock-data";
import { usePass } from "@/lib/pass-context";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import MessageDisplay from "@/components/booking/MessageDisplay";
import PricingModal from "@/components/booking/PricingModal";

const timeOptions = Array.from({ length: 23 }, (_, i) => {
  const hour = Math.floor(i / 2) + 11;
  const min = i % 2 === 0 ? "00" : "30";
  const time = `${hour}:${min}`;
  return { value: time, label: time };
});

export default function GeneratePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { hasActivePass } = usePass();
  const { isLoggedIn } = useAuth();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [specialRequests, setSpecialRequests] = useState("");
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ ja: string; en: string } | null>(null);
  const [showPricingModal, setShowPricingModal] = useState(false);

  const restaurant = getRestaurantById(id);

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-light-100 mb-4">Restaurant not found</h1>
        <Button onClick={() => router.push("/search")}>Back to Search</Button>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!hasActivePass) {
      setShowPricingModal(true);
      return;
    }

    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const result = generateMockMessage(restaurant, date, time, Number(partySize), specialRequests, allergies);
    setMessage(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="text-light-300 hover:text-light-100 text-sm mb-4 inline-flex items-center gap-1 transition-colors">
        ← Back
      </button>

      <h1 className="text-2xl font-bold text-light-100 mb-1">Generate Booking Message</h1>
      <p className="text-light-300 mb-6">
        for <span className="text-light-100 font-medium">{restaurant.name_en}</span>{" "}
        <span className="text-light-300">({restaurant.name_ja})</span>
      </p>

      {!message ? (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-light-300">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-light-100 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <Select
              label="Time"
              placeholder="Select time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              options={timeOptions}
            />

            <Select
              label="Party Size"
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              options={Array.from({ length: 10 }, (_, i) => ({
                value: String(i + 1),
                label: `${i + 1} ${i === 0 ? "person" : "people"}`,
              }))}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-light-300">Special Requests</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="e.g., Counter seat preferred, Anniversary dinner"
                rows={2}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-light-100 placeholder:text-light-300/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-light-300">Allergies / Dietary Restrictions</label>
              <textarea
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g., No shellfish, Vegetarian"
                rows={2}
                className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-light-100 placeholder:text-light-300/50 focus:outline-none focus:border-primary transition-colors resize-none"
              />
            </div>

            {loading ? (
              <LoadingSpinner text="Generating your message in Japanese..." />
            ) : (
              <Button
                size="lg"
                className="w-full mt-2"
                onClick={handleGenerate}
                disabled={!date || !time}
              >
                Generate Message
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-dark-800 border border-dark-600 rounded-xl p-5">
          <MessageDisplay
            messageJa={message.ja}
            messageEn={message.en}
            onSave={() => {
              alert("Message saved!");
              router.push("/messages");
            }}
          />
        </div>
      )}

      <PricingModal isOpen={showPricingModal} onClose={() => setShowPricingModal(false)} />
    </div>
  );
}
