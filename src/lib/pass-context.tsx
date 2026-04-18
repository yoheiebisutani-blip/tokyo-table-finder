"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface Pass {
  type: "7day" | "14day" | "30day";
  started_at: string;
  expires_at: string;
}

interface PassContextType {
  pass: Pass | null;
  hasActivePass: boolean;
  refreshFromDB: () => Promise<void>;
}

const PassContext = createContext<PassContextType | undefined>(undefined);

export function PassProvider({ children }: { children: ReactNode }) {
  const [pass, setPass] = useState<Pass | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshFromDB = useCallback(async () => {
    try {
      const res = await fetch("/api/user/pass");
      if (!res.ok) return;
      const data = await res.json();
      if (data.has_active_pass && data.pass_type && data.expires_at) {
        setPass({
          type: data.pass_type,
          started_at: new Date().toISOString(),
          expires_at: data.expires_at,
        });
      } else {
        setPass(null);
      }
    } catch {
      // Not logged in or network error — leave pass as-is
    }
  }, []);

  useEffect(() => {
    refreshFromDB().finally(() => setIsLoaded(true));
  }, [refreshFromDB]);

  const hasActivePass = pass ? new Date(pass.expires_at) > new Date() : false;

  if (!isLoaded) {
    return <>{children}</>;
  }

  return (
    <PassContext.Provider value={{ pass, hasActivePass, refreshFromDB }}>
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
