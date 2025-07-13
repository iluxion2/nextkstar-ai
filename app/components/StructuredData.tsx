export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "KStar - AI Face Analysis",
    "description": "Get your AI beauty score, find celebrity lookalikes, and explore beauty bias insights with our revolutionary AI technology.",
    "url": "https://nextkstar.com",
    "applicationCategory": "EntertainmentApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "KStar Team"
    },
    "featureList": [
      "AI Face Analysis",
      "Beauty Score Calculation", 
      "Celebrity Lookalike Matching",
      "Beauty Bias Insights",
      "Free Analysis"
    ],
    "screenshot": "https://nextkstar.com/images/favicon.fav.png",
    "softwareVersion": "1.0.0"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 