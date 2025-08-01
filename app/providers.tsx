"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { AuthContext } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import Toast from "../components/Toast";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const supabase = createClient();

      try {
        // Get initial session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
        }

        setUser(session?.user ?? null);

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(
          (event: AuthChangeEvent, session: Session | null) => {
            console.log("Auth state changed:", event, session?.user?.email);
            setUser(session?.user ?? null);
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <Layout>
        {children}
        <Toast />
      </Layout>
    </AuthContext.Provider>
  );
}
