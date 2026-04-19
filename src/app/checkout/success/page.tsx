"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { usePass } from "@/lib/pass-context";
import Button from "@/components/ui/Button";
import Link from "next/link";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshFromDB } = usePass();
  const redirectTo = searchParams.get("redirect_to") || "/search";
  const passType = searchParams.get("pass_type");
  const [ready, setReady] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!passType || passType === "single") {
      setReady(true);
      return;
    }

    let count = 0;
    const maxAttempts = 12;

    const poll = async () => {
      count++;
      try {
        const res = await fetch("/api/user/pass");
        if (res.ok) {
          const data = await res.json();
          if (data.has_active_pass) {
            await refreshFromDB();
            setReady(true);
            return;
          }
        }
      } catch {
        // ignore fetch errors
      }
      setAttempts(count);
      if (count < maxAttempts) {
        setTimeout(poll, 1500);
      } else {
        setReady(true);
      }
    };

    setTimeout(poll, 1500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">🎉</div>
      <h1 className="text-2xl font-bold text-light-100 mb-3">Payment Successful!</h1>
      <p className="text-light-300 mb-8">
        Your pass is now active. Generate booking messages for your entire trip.
      </p>
      {ready ? (
        <div className="flex flex-col gap-3">
          <Button onClick={() => router.push(redirectTo)} size="lg" className="w-full">
            {redirectTo.includes("/generate") ? "Continue to Message" : "Find Restaurants"}
          </Button>
          <Link href="/account" className="text-sm text-light-300 hover:text-light-100 transition-colors">
            View account
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-light-300 text-sm mb-2">Activating your pass{attempts > 0 ? ` (${attempts}/12)` : ""}...</p>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      )}
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto px-4 py-24 text-center">
          <div className="text-5xl mb-6">🎉</div>
          <p className="text-light-300">Loading...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
