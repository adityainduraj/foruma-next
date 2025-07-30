"use client";

// components/Navbar.tsx

import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.css";

const Navbar = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Overweb
        </Link>
        <div className={styles.navLinks}>
          {user ? (
            <>
              <span className={styles.navUsername}>{user.email}</span>
              <button onClick={handleLogout} className={styles.navButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.navButton}>
                Login
              </Link>
              <Link href="/signup" className={styles.navButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
