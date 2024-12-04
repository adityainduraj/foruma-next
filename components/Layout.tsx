// components/Layout.tsx
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ReactNode } from "react";
import styles from "../styles/Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

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
