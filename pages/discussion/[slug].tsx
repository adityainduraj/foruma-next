// pages/discussion/[slug].tsx

import { CommentData } from "../../types/supabase";
import { useContext, useEffect } from "react";
import styles from "../../styles/Discussion.module.css";
import CommentSection from "../../components/CommentSection";
import type { NextPage, GetServerSideProps } from "next";
import SEO from "../../components/SEO";
import cheerio from "cheerio";

interface DiscussionPageProps {
  link: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
}

const DiscussionPage: NextPage<DiscussionPageProps> = ({
  link,
  ogTitle,
  ogDescription,
  ogImage,
}) => {
  return (
    <>
      <SEO title={ogTitle} description={ogDescription} image={ogImage} />
      <div className={styles.discussion}>
        <div className={styles.linkPreview}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <h2>{ogTitle || link}</h2>
            <p>{ogDescription || "No description available."}</p>
            {ogImage && <img src={ogImage} alt="Link Preview Image" />}
          </a>
        </div>
        <CommentSection link={link} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.query;
  const decodedUrl = decodeURIComponent((slug as string) || "");

  // Initialize default Open Graph data
  let ogTitle = "";
  let ogDescription = "";
  let ogImage = "";

  try {
    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ForumaBot/1.0)",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract Open Graph metadata
    ogTitle =
      $('meta[property="og:title"]').attr("content") || $("title").text() || "";
    ogDescription =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";
    ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    // Handle relative image URLs
    if (ogImage && !ogImage.startsWith("http")) {
      const url = new URL(decodedUrl);
      ogImage = `${url.protocol}//${url.host}${ogImage}`;
    }
  } catch (error) {
    console.error("Error fetching Open Graph data:", error);
    // Fallback to the URL if fetching fails
  }

  return {
    props: {
      link: decodedUrl,
      ogTitle,
      ogDescription,
      ogImage,
    },
  };
};

export default DiscussionPage;
