"use client";

import { useState, useMemo } from "react";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import RestaurantCard from "@/components/restaurant/RestaurantCard";
import { AREAS, CUISINES, BUDGETS, getRestaurants } from "@/lib/mock-data";

export default function SearchPage() {
  const [area, setArea] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [budget, setBudget] = useState("");
  const [partySize, setPartySize] = useState("");
  const [searched, setSearched] = useState(false);

  const results = useMemo(() => {
    if (!searched) return [];
    const budgetObj = BUDGETS.find((b) => b.label === budget);
    return getRestaurants({
      area: area || undefined,
      cuisine: cuisine || undefined,
      budgetMin: budgetObj?.min,
      budgetMax: budgetObj?.max,
    });
  }, [area, cuisine, budget, searched]);

  const handleSearch = () => {
    setSearched(true);
  };

  const handleReset = () => {
    setArea("");
    setCuisine("");
    setBudget("");
    setPartySize("");
    setSearched(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-6">Find Restaurants</h1>

      {/* Filters */}
      <div className="bg-dark-800 border border-dark-600 rounded-xl p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Area"
            placeholder="All Areas"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            options={AREAS.map((a) => ({ value: a.toLowerCase(), label: a }))}
          />
          <Select
            label="Cuisine"
            placeholder="All Cuisines"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            options={CUISINES.map((c) => ({ value: c.toLowerCase(), label: c }))}
          />
          <Select
            label="Budget"
            placeholder="Any Budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            options={BUDGETS.map((b) => ({ value: b.label, label: b.label }))}
          />
          <Select
            label="Party Size"
            placeholder="Any"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
            options={Array.from({ length: 10 }, (_, i) => ({
              value: String(i + 1),
              label: `${i + 1} ${i === 0 ? "person" : "people"}`,
            }))}
          />
        </div>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleSearch}>Find Restaurants</Button>
          <Button variant="outline" onClick={handleReset}>Reset</Button>
        </div>
      </div>

      {/* Results */}
      {searched && (
        <>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-light-300 text-lg">No restaurants found. Try adjusting your filters.</p>
            </div>
          )}
        </>
      )}

      {!searched && (
        <div className="text-center py-16">
          <p className="text-light-300 text-lg">
            Select your preferences and click &quot;Find Restaurants&quot; to start exploring.
          </p>
        </div>
      )}
    </div>
  );
}
