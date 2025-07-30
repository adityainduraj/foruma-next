"use client";

// app/signup/page.tsx

import { useState, useContext, FormEvent, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "../../styles/Auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success(
          "Account created successfully! Please check your email for verification."
        );
        router.push("/");
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        setErrorMsg(error.message);
        toast.error(error.message);
      } else {
        setErrorMsg("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If user is authenticated, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className={styles.authContainer}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup} className={styles.authForm}>
        <input
          type="email"
          placeholder="Email"
          className={styles.authInput}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.authInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
        <button type="submit" className={styles.authButton} disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
