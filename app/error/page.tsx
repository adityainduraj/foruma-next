"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../../styles/Auth.module.css";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error =
    searchParams.get("message") || "An error occurred during authentication";

  useEffect(() => {
    // Redirect back to login after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.authContainer}>
      <h1>Authentication Error</h1>
      <div className={styles.errorMsg}>
        <p>{error}</p>
        <p>You will be redirected to the login page in a few seconds...</p>
      </div>
      <button
        className={styles.authButton}
        onClick={() => router.push("/login")}
      >
        Back to Login
      </button>
    </div>
  );
}
