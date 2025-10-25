import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AppProvider } from "../context/AppContext";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  useEffect(() => {
    // Run this only on the client side
    if (typeof window === "undefined") return;

    if (!initialRedirectDone) {
      const isAuthenticated =
        typeof window !== "undefined" &&
        localStorage.getItem("isAuthenticated") === "true";

      // Redirect only if user not logged in and not already on /auth
      if (!isAuthenticated && router.pathname !== "/auth") {
        router.replace("/auth");
      }

      // Mark that initial redirect has been handled
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
