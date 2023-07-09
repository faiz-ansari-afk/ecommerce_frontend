export const pageview = (url) => {
    if (window !== undefined) {
      window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
        page_path: url,
      });
    }
  };
  
  export const event = ({ action, params }) => {
    if (window !== undefined) {
      window.gtag("event", action, params);
    }
  };