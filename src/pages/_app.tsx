import "@/styles/globals.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import Application from "@/app";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Application>
          <Component {...pageProps} />
        </Application>
        <ToastContainer />
      </Hydrate>
    </QueryClientProvider>
  );
}
