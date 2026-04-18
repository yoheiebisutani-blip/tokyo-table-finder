"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { usePass } from "@/lib/pass-context";
import Button from "@/components/ui/Button";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshFromDB } = usePass();
  const redirectTo = searchParams.get("redirect_to") || "/search";
  const passType = searchParams.get("pass_type");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!passType || passType === "single") {
      setReady(true);
      return;
    }

    // Poll until webhook has processed and pass appears in DB (up to 10s)
    let attempts = 0;
    const maxAttempts = 10;

    const poll = async () => {
      attempts++;
      try {
        const res = await fetch("/api/user/pass");
        const data = await res.json();
        if (data.has_active_pass) {
          await refreshFromDB();
          setReady(true);
          return;
        }
      } catch {
        // ignore
      }
      if (attempts < maxAttempts) {
        setTimeout(poll, 1000);
      } else {
        setReady(true);
      }
    };

    setTimeout(poll, 1000);
  }, [passType, refreshFromDB]);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-light-100 mb-3">Payment Successful!</h1>
      <p className="text-light-300 mb-8">
        Your pass is now active. You can generate booking messages for your entire trip.
      </p>
      {ready ? (
        <Button onClick={() => router.push(redirectTo)} size="lg" className="w-full">
          {redirectTo.includes("/generate") ? "Continue to Message" : "Find Restaurants"}
        </Button>
      ) : (
        <p className="text-light-300 text-sm">Activating your pass...</p>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-4 py-24 text-center"><p className="text-light-300">Loading...</p></div>}>
      <SuccessContent />
    </Suspense>
  );
}
