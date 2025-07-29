// components/SEO.tsx
import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const SEO = ({
  title = "Overweb - Discuss Any Web Content",
  description = "Join conversations about any article or webpage. Connect with others through meaningful discussions across the web.",
  image = "/og-image.jpg",
}: SEOProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default SEO;
