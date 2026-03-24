"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Pass {
  type: "7day" | "14day" | "30day";
  started_at: string;
  expires_at: string;
}

interface PassContextType {
  pass: Pass | null;
  hasActivePass: boolean;
  activatePass: (type: "7day" | "14day" | "30day") => void;
  deactivatePass: () => void;
}

const PassContext = createContext<PassContextType | undefined>(undefined);

export function PassProvider({ children }: { children: ReactNode }) {
  const [pass, setPass] = useState<Pass | null>(null);

  const activatePass = (type: "7day" | "14day" | "30day") => {
    const now = new Date();
    const days = type === "7day" ? 7 : type === "14day" ? 14 : 30;
    const expires = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    setPass({
      type,
      started_at: now.toISOString(),
      expires_at: expires.toISOString(),
    });
  };

  const deactivatePass = () => {
    setPass(null);
  };

  const hasActivePass = pass ? new Date(pass.expires_at) > new Date() : false;

  return (
    <PassContext.Provider value={{ pass, hasActivePass, activatePass, deactivatePass }}>
      {children}
    </PassContext.Provider>
  );
}

export function usePass() {
  const context = useContext(PassContext);
  if (context === undefined) {
    throw new Error("usePass must be used within a PassProvider");
  }
  return context;
}
