"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function CheckoutCancelPage() {
  const router = useRouter();

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">😕</div>
      <h1 className="text-2xl font-bold text-light-100 mb-3">Payment Cancelled</h1>
      <p className="text-light-300 mb-8">
        No charge was made. You can try again anytime.
      </p>
      <Button onClick={() => router.push("/search")} size="lg" className="w-full">
        Back to Search
      </Button>
    </div>
  );
}
