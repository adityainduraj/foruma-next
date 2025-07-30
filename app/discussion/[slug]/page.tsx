"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../../../styles/Discussion.module.css";
import CommentSection from "../../../components/CommentSection";
import SEO from "../../../components/SEO";
import { OGData } from "../../../types";

const DiscussionPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const [link, setLink] = useState("");
  const [ogData, setOgData] = useState<OGData>({
    title: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const decodedUrl = decodeURIComponent(slug);
      setLink(decodedUrl);

      // Fetch Open Graph data
      fetchOGData(decodedUrl);
    }
  }, [slug]);

  const fetchOGData = async (url: string) => {
    try {
      setLoading(true);
      // You'll need to create an API route for this or use a service
      const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
      if (response.ok) {
        const data = await response.json();
        setOgData({
          title: data.title || url,
          description: data.description || "No description available.",
          image: data.image || "",
        });
      } else {
        setOgData({
          title: url,
          description: "No description available.",
          image: "",
        });
      }
    } catch (error) {
      console.error("Error fetching OG data:", error);
      setOgData({
        title: url,
        description: "No description available.",
        image: "",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.discussion}>
        <div className={styles.linkPreview}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={ogData.title}
        description={ogData.description}
        image={ogData.image}
      />
      <div className={styles.discussion}>
        <div className={styles.linkPreview}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            <h2>{link}</h2>
            <p>{ogData.description || ogData.title}</p>
            {ogData.image && (
              <img src={ogData.image} alt="Link Preview Image" />
            )}
          </a>
        </div>
        <CommentSection link={link} />
      </div>
    </>
  );
};

export default DiscussionPage;
