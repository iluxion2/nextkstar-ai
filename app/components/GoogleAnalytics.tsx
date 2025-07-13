export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics 4 */}
      <script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_title: 'KStar - AI Face Analysis',
              page_location: window.location.href,
            });
          `,
        }}
      />
      
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="your-verification-code" />
    </>
  );
} 