// pages/discussion/[slug].tsx

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
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(decodedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OverwebBot/1.0)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

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
      try {
        const url = new URL(decodedUrl);
        ogImage = `${url.protocol}//${url.host}${ogImage}`;
      } catch (urlError) {
        console.error("Error constructing absolute image URL:", urlError);
        ogImage = ""; // Reset on error
      }
    }
  } catch (error) {
    console.error("Error fetching Open Graph data for", decodedUrl, ":", error);
    // Set fallback values
    ogTitle = decodedUrl;
    ogDescription = "Discussion about this link";
  }

  return {
    props: {
      link: decodedUrl,
      ogTitle: ogTitle || decodedUrl,
      ogDescription: ogDescription || "Join the discussion about this link",
      ogImage: ogImage || "",
    },
  };
};

export default DiscussionPage;
