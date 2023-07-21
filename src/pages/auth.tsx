import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import Image from "next/image";
import { setCookie } from "nookies";
import { useGetProfileFromToken } from "@/lib/queries";

export default function Auth() {
  const [token, setToken] = useState("");
  const { data } = useGetProfileFromToken(token);
  const router = useRouter();

  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.hash));
    setToken(params["#access_token"]);
    setCookie(null, "token", params["#access_token"], {
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
  }, []);

  if (data) {
    if (Boolean(router.query.next)) {
      window.location.href = String(router.query.next);
    } else {
      window.location.href = "/";
    }
  }

  if (data === null) {
    // unauthorized
    window.location.href = "/sign-in?user=unauthorized";
  }

  return (
    <>
      <Head>
        <title>Authentication</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css"
        />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></Script>
      <div className="w-screen h-screen flex flex-col items-center justify-center relative">
        <div className="mt-7 font-light flex items-center gap-10 flex-col">
          <Image
            src="/disciplr-logo.png"
            alt="disciplr"
            width="100"
            height="100"
          />

          <div className="w-[55px]">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 120 30"
              xmlns="http://www.w3.org/2000/svg"
              fill="#6e7ac5"
            >
              <circle cx="15" cy="15" r="15">
                <animate
                  attributeName="r"
                  from="15"
                  to="15"
                  begin="0s"
                  dur="0.8s"
                  values="15;9;15"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="1"
                  to="1"
                  begin="0s"
                  dur="0.8s"
                  values="1;.5;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="60" cy="15" r="9" fill-opacity="0.3">
                <animate
                  attributeName="r"
                  from="9"
                  to="9"
                  begin="0s"
                  dur="0.8s"
                  values="9;15;9"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="0.5"
                  to="0.5"
                  begin="0s"
                  dur="0.8s"
                  values=".5;1;.5"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
              <circle cx="105" cy="15" r="15">
                <animate
                  attributeName="r"
                  from="15"
                  to="15"
                  begin="0s"
                  dur="0.8s"
                  values="15;9;15"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="fill-opacity"
                  from="1"
                  to="1"
                  begin="0s"
                  dur="0.8s"
                  values="1;.5;1"
                  calcMode="linear"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
