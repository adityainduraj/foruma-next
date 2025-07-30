"use client";

// app/login/page.tsx
import { useState, useContext, FormEvent, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "../../styles/Auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
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

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success("Successfully logged in!");
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.message);
      toast.error(error.message);
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
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.authForm}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
