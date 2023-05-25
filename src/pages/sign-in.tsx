import { supabase } from "@/lib/supabase";
import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Home() {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });
  };

  const handleSignInByEmailPassword = () => {
    setIsSigningIn(true);

    supabase.auth
      .signInWithPassword({
        email: (document.getElementById("email") as HTMLInputElement)?.value ?? "", // prettier-ignore
        password: (document.getElementById("password") as HTMLInputElement)?.value ?? "", // prettier-ignore
      })
      .then((res: any) => {
        if (!res?.error)
          return (window.location.href = `${window.location.origin}/auth#access_token=${res.data.session?.access_token}`);
        else
          toast.error(res.error?.message, {
            autoClose: 750,
            hideProgressBar: true,
            position: "top-center",
          });
      })
      .catch((err: any) => console.log(err))
      .finally(() => setIsSigningIn(false));
  };

  useEffect(() => {
    if (router.query.provider === "google") {
      document.getElementById("sign-in-with-google")?.click?.();
    }

    if (router.query.token === "expired") {
      toast("Your session has expired. Please sign in again.", {
        autoClose: 2500,
      });
    }

    if (router.query.user === "unauthorized") {
      // unauthorized login message
      toast.warn(
        "This email is not yet registered. Please contact your disciplr.",
        {
          autoClose: 3000,
          hideProgressBar: true,
          position: "top-center",
        }
      );
    }
  }, [router]);

  useEffect(() => {
    document.getElementById("email")?.focus();
  }, []);

  return (
    <>
      <Head>
        <title>Director&apos;s Access | Sign In</title>
        <meta name="description" content="Director's Access | Sign In" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className="w-screen w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-7">
            <Image
              src="/disciplr-logo.png"
              alt="disciplr"
              width="100"
              height="100"
            />
          </div>
          <h1 className="text-3xl py-3">Director&apos;s Access</h1>
          <span className="text-base font-light text-gray-400">
            Sign in to continue
          </span>
          <div className="my-7 px-7">
            <input
              id="email"
              disabled={isSigningIn}
              placeholder="Email"
              className="w-full px-4 py-2 border-2 rounded-xl mt-2 border-gray-300"
            />
            <input
              id="password"
              disabled={isSigningIn}
              placeholder="Password"
              type="password"
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSignInByEmailPassword();
                }
              }}
              className="w-full px-4 py-2 border-2 rounded-xl mt-2 border-gray-300"
            />
          </div>
          <button
            disabled={isSigningIn}
            onClick={handleSignInByEmailPassword}
            className="bg-[#6e7ac5] disabled:opacity-50 text-white px-14 py-3 rounded-xl hover:shadow-md"
          >
            Sign in
          </button>
          <div />
          <button
            id="sign-in-with-google"
            onClick={handleSignInWithGoogle}
            className="mt-14 text-base text-[#6e7ac5]"
          >
            Sign in with <strong className="text-primary">Google</strong>
          </button>
        </div>
      </main>
    </>
  );
}
