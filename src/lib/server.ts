import { GetServerSidePropsContext } from "next";
import jwt from "jsonwebtoken";

export function getServerSidePropsWithAuth(
  getServerSidePropsFunc?: (ctx: GetServerSidePropsContext) => any
) {
  return async (ctx: GetServerSidePropsContext) => {
    let getServerSidePropsFuncResult = {};

    if (getServerSidePropsFunc) {
      getServerSidePropsFuncResult = (await getServerSidePropsFunc(ctx)) || {};
    }

    const token = ctx.req.headers.cookie?.split("=")[1];

    // todo: validate token in api
    // check if token is valid

    if (token) {
      return {
        ...getServerSidePropsFuncResult,
        props: {
          token: token ?? null,
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

    let destination = `https://sso.fishgen.org?client_id=disciplr&response_type=token&redirect_uri=${redirect_uri}&scope=openid%20profile%20email&state=disciplr`;

    return {
      redirect: {
        destination: destination,
        permanent: true,
      },
    };
  };
}
