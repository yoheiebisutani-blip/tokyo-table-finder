"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

interface PassStatus {
  has_active_pass: boolean;
  pass_type: string | null;
  expires_at: string | null;
  days_remaining: number | null;
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const [passStatus, setPassStatus] = useState<PassStatus | null>(null);
  const [loadingPass, setLoadingPass] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/user/pass")
      .then((r) => r.json())
      .then((data) => setPassStatus(data))
      .catch(() => setPassStatus(null))
      .finally(() => setLoadingPass(false));
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-light-100 mb-4">Account</h1>
        <p className="text-light-300 mb-6">Please log in to view your account.</p>
        <Link href="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-light-100 mb-6">Account</h1>

      {/* Pass status */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-light-100 mb-3">Pass Status</h2>
        {loadingPass ? (
          <p className="text-light-300 text-sm">Loading...</p>
        ) : passStatus?.has_active_pass ? (
          <div>
            <p className="text-light-200">
              <span className="font-semibold capitalize">
                {passStatus.pass_type?.replace("day", "-Day")} Pass
              </span>
              {" — "}
              {passStatus.days_remaining} day{passStatus.days_remaining !== 1 ? "s" : ""} remaining
            </p>
            {passStatus.expires_at && (
              <p className="text-sm text-light-300 mt-1">
                Expires{" "}
                {new Date(passStatus.expires_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        ) : (
          <div>
            <p className="text-light-300 mb-3">No active pass</p>
            <Link href="/pricing">
              <Button size="sm">Buy a Pass</Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Profile */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-light-100 mb-3">Profile</h2>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-sm text-light-300">Email</span>
            <p className="text-light-100">{user?.email}</p>
          </div>
        </div>
      </Card>

      <Button
        variant="outline"
        onClick={() => {
          logout();
          router.push("/");
        }}
        className="w-full"
      >
        Log Out
      </Button>
    </div>
  );
}
