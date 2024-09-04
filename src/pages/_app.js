import { useEffect } from "react";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { HearingLossRiskProvider } from "@/context/HearingLossRiskContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import * as gtag from "../../lib/gtag";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <ChakraProvider>
      <HearingLossRiskProvider>
        <main>
          <Component {...pageProps} />
          <Analytics />
          <SpeedInsights />
        </main>
      </HearingLossRiskProvider>
    </ChakraProvider>
  );
}
