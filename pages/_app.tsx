import React from "react";
import { AppProps } from "next/app";
import "../styles/globals.css"; // or whatever global styles you have

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
