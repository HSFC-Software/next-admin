import "@/styles/globals.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
