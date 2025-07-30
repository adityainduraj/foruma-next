// components/Layout.tsx
import Navbar from "./Navbar";
import Footer from "./Footer";
import { LayoutProps } from "../types";
import styles from "../styles/Layout.module.css";

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
