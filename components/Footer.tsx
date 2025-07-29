// components/Footer.tsx
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p>© {new Date().getFullYear()} Overweb. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
