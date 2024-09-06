import { useEffect } from "react";
import { useRouter } from "next/router";
import { ChakraProvider } from "@chakra-ui/react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import * as gtag from "../../lib/gtag";
import "@/styles/globals.css";
import { SilicosisRiskProvider } from "@/context/SilicosisRiskContext";

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
      <SilicosisRiskProvider>
        <main>
          <Component {...pageProps} />
          <Analytics />
          <SpeedInsights />
        </main>
      </SilicosisRiskProvider>
    </ChakraProvider>
  );
}
