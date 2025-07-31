// app/signup/page.tsx

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../../styles/Auth.module.css";
import { AuthContext } from "../../contexts/AuthContext";
import { signup } from "../../utils/actions";

const SignupPage = () => {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // If user is authenticated, don't render the form
  if (user) {
    return null;
  }

  return (
    <div className={styles.authContainer}>
      <h1>Sign Up</h1>
      <form action={signup} className={styles.authForm}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.authInput}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className={styles.authInput}
          required
        />
        <button type="submit" className={styles.authButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
