// app/login/page.tsx
"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { signInWithGoogle } from "../../utils/actions";
import { createClient } from "../../utils/supabase/client";
import LoadingSpinner from "../../components/LoadingSpinner";

const LoginPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Auth state will be updated automatically through the AuthContext listener
        // The user will be redirected in the useEffect below
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Give some time for the auth context to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [user, router, isLoading]);

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className={styles.authContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  // If user is authenticated, show loading while redirecting
  if (user) {
    return (
      <div className={styles.authContainer}>
        <LoadingSpinner />
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <h1>Login</h1>
      {error && <div className={styles.errorMsg}>{error}</div>}
      <form onSubmit={handleEmailLogin} className={styles.authForm}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.authInput}
          required
          disabled={isSubmitting}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.authInput}
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className={styles.authButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className={`${styles.authButton} ${styles.googleButton}`}
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
