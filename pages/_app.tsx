// pages/_app.tsx
import "../styles/globals.css";
import Toast from "../components/Toast";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { AuthContext } from "../contexts/AuthContext";
import Layout from "../components/Layout";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
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
        },
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
        <Component {...pageProps} />
        <Toast />
      </Layout>
    </AuthContext.Provider>
  );
}

export default MyApp;
