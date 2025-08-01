// app/auth/auth-code-error/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Auth.module.css";

const AuthCodeErrorPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className={styles.authContainer}>
      <h1>Authentication Error</h1>
      <p>
        There was an error during the authentication process. This could be due
        to:
      </p>
      <ul style={{ textAlign: "left", margin: "1rem 0" }}>
        <li>Invalid or expired authentication code</li>
        <li>Configuration issues with your OAuth provider</li>
        <li>Network connectivity problems</li>
      </ul>
      <p>You will be redirected to the login page in 5 seconds.</p>
      <button
        onClick={() => router.push("/login")}
        className={styles.authButton}
        style={{ marginTop: "1rem" }}
      >
        Return to Login
      </button>
    </div>
  );
};

export default AuthCodeErrorPage;
