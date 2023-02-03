import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { useEffect } from "react";
import jwt from "jsonwebtoken";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default function Home() {
  useEffect(() => {
    const params = Object.fromEntries(new URLSearchParams(location.hash));
    const access_token = params["#access_token"];
    localStorage.setItem("access_token", access_token);

    // TODO: Verify user if the email has access to the app
    if (access_token) {
      //
    }
  }, []);

  return (
    <>
      <Head>
        <title>Authentication</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-screen h-screen">{/* preloader here */}</main>
    </>
  );
}
