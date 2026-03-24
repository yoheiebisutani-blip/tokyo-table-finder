"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (tab === "login") {
      const { error } = await login(email, password);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
    } else {
      const { error } = await signup(email, password);
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/search");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Tab switcher */}
      <div className="flex border-b border-dark-600 mb-8">
        <button
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            tab === "login"
              ? "text-primary border-b-2 border-primary"
              : "text-light-300 hover:text-light-100"
          }`}
          onClick={() => setTab("login")}
        >
          Log In
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium transition-colors ${
            tab === "signup"
              ? "text-primary border-b-2 border-primary"
              : "text-light-300 hover:text-light-100"
          }`}
          onClick={() => setTab("signup")}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-light-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-light-100 placeholder:text-light-300/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-light-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="bg-dark-700 border border-dark-600 rounded-lg px-3 py-2.5 text-light-100 placeholder:text-light-300/50 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
          {loading ? "Loading..." : tab === "login" ? "Log In" : "Create Account"}
        </Button>

        <button
          type="button"
          disabled
          className="w-full py-2.5 border border-dark-600 rounded-lg text-light-300 text-sm flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
          </svg>
          Continue with Google (Coming Soon)
        </button>

        <p className="text-sm text-center text-light-300 mt-2">
          {tab === "login" ? (
            <>Don&apos;t have an account? <button type="button" onClick={() => setTab("signup")} className="text-primary hover:text-primary-hover">Sign up</button></>
          ) : (
            <>Already have an account? <button type="button" onClick={() => setTab("login")} className="text-primary hover:text-primary-hover">Log in</button></>
          )}
        </p>
      </form>
    </div>
  );
}
