export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "KStar - AI Face Analysis & Beauty Score",
    "description": "Find out how hot you are with our AI attractiveness test. Get your beauty score, discover your celebrity lookalike, and explore k-beauty insights. Perfect for kpop fans, BTS and BLACKPINK lovers, and anyone curious about their beauty rating.",
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
      "How Hot Am I Test",
      "AI Attractiveness Test", 
      "Beauty Score Calculation",
      "Celebrity Lookalike Matching",
      "K-Beauty Analysis",
      "Kpop Celebrity Matches",
      "BTS & BLACKPINK Comparisons",
      "Free Beauty Rating",
      "Relationship Beauty Insights"
    ],
    "screenshot": "https://nextkstar.com/images/favicon.fav.png",
    "softwareVersion": "1.0.0",
    "keywords": "how hot am i, attractiveness test, beauty score, celebrity lookalike, k-beauty, kpop, BTS, BLACKPINK, Jennie, boyfriend, girlfriend, hot or not, am i attractive, beauty rating, korean beauty, k-pop idols"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 