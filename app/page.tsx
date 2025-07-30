"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Home.module.css";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;
    const encodedUrl = encodeURIComponent(url);
    router.push(`/discussion/${encodedUrl}`);
  };

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Overweb</h1>
        <p className={styles.subtitle}>Let's talk about it</p>
        <form className={styles.searchForm} onSubmit={handleFormSubmit}>
          <input
            type="url"
            placeholder="Paste the article link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Discuss
          </button>
        </form>
      </section>

      <section className={styles.landing}>
        <h2 className={styles.sectionTitle}>Join Conversations Anywhere</h2>
        <p className={styles.sectionDescription}>
          Overweb allows you to discuss any article or webpage with others. No
          more scattered threads or account sign-ups.
        </p>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Our Mission</h3>
            <p>
              Connecting people through meaningful discussions on any content
              across the web.
            </p>
          </div>
          <div className={styles.card}>
            <h3>Simple &amp; Accessible</h3>
            <p>Just paste a link and start chatting. It's that easy.</p>
          </div>
          <div className={styles.card}>
            <h3>Unified Platform</h3>
            <p>
              All your discussions in one place, no matter where the content is
              hosted.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
