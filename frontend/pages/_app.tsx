import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "../context/AppContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  // Only redirect to auth on initial load
  useEffect(() => {
    if (!initialRedirectDone) {
      // Check if user is authenticated
      const isAuthenticated =
        localStorage.getItem("isAuthenticated") === "true";

      // If not authenticated and not on auth page, redirect to auth
      if (!isAuthenticated && router.pathname !== "/auth") {
        router.replace("/auth");
      }

      setInitialRedirectDone(true);
    }
  }, [router, initialRedirectDone]);

  return (
    <AppProvider>
      <Head>
        <title>HackHub - Collaborative Hackathon Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </AppProvider>
  );
}
