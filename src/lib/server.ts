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

    const token = ctx.req.cookies?.token;
    const decoded = jwt.decode(token ?? "");

    if (!decoded) {
      //
      return {
        redirect: {
          destination: "/sign-in",
          permanent: false,
        },
      };
    }

    return {
      ...getServerSidePropsFuncResult,
      props: {
        token: token ?? null,
      },
    };
  };
}
