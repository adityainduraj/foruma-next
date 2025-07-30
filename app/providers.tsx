"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
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

  useEffect(() => {
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user ?? null);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      <Layout>
        {children}
        <Toast />
      </Layout>
    </AuthContext.Provider>
  );
}
