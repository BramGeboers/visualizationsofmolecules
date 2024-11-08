import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "flag-icons/css/flag-icons.min.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
};

export default App;
