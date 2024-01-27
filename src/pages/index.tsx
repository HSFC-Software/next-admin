import { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const token = ctx.req.headers.cookie?.split("=")[1];

  if (token) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  let protocol = "http";

  if (process.env.NODE_ENV === "production") {
    protocol += "s";
  }

  const baseUrl = protocol + "://" + ctx.req.headers.host;
  let redirect_uri = `${baseUrl}/auth`;

  if (ctx.query.redirect_uri) {
    redirect_uri += "?next=" + ctx.query.redirect_uri;
  }

  let destination = `https://sso-disciplr.netlify.app?client_id=disciplr&response_type=token&redirect_uri=${redirect_uri}&scope=openid%20profile%20email&state=disciplr`;

  return {
    redirect: {
      destination: destination,
      permanent: true,
    },
  };
};

export default function Home() {
  return <></>;
}
