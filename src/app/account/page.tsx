"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { usePass } from "@/lib/pass-context";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const { pass, hasActivePass, activatePass, deactivatePass } = usePass();

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
        {hasActivePass && pass ? (
          <div>
            <p className="text-light-200">
              <span className="font-semibold capitalize">{pass.type.replace("day", "-Day")} Pass</span>
              {" — "}
              Expires {new Date(pass.expires_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
            <Button variant="outline" size="sm" className="mt-3" onClick={deactivatePass}>
              Deactivate (Dev)
            </Button>
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

      {/* Dev tools for testing */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-light-100 mb-3">Dev Tools (Testing)</h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => activatePass("7day")}>Activate 7-Day</Button>
          <Button size="sm" variant="outline" onClick={() => activatePass("14day")}>Activate 14-Day</Button>
          <Button size="sm" variant="outline" onClick={() => activatePass("30day")}>Activate 30-Day</Button>
        </div>
      </Card>

      {/* Profile */}
      <Card className="mb-6">
        <h2 className="text-lg font-bold text-light-100 mb-3">Profile</h2>
        <div className="flex flex-col gap-2">
          <div>
            <span className="text-sm text-light-300">Email</span>
            <p className="text-light-100">{user?.email}</p>
          </div>
          <div>
            <span className="text-sm text-light-300">Display Name</span>
            <p className="text-light-100">{user?.display_name}</p>
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
