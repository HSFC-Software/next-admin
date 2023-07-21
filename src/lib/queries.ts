import { useQuery } from "react-query";
import {
  Profile,
  getConsolidators,
  getDisciples,
  getProfileByEmail,
  getVips,
  searchProfile,
} from "./api";
import jwt from "jsonwebtoken";

export const useGetVips = (status?: "ASSIGNED" | "PENDING") => {
  return useQuery(["getVips", { status }], async () => await getVips(status), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

export const useGetConsolidators = () => {
  return useQuery(["getConsolidators"], async () => await getConsolidators(), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

export const useGetDisciples = (q: string) => {
  return useQuery(["getDisciples", { q }], async () => await getDisciples(q), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

export const useGetProfileFromToken = (token: string) => {
  type UserMetadata = {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    picture: string;
    provider_id: string;
    sub: string;
  };

  let userMetadata = {} as UserMetadata;
  let email = "";

  try {
    const data = jwt.decode(token);
    userMetadata = (data as any)?.user_metadata as UserMetadata;
    email = userMetadata?.email ?? (data as any)?.email;
  } catch (err) {}

  return useQuery<Profile | null>(
    ["getProfile", { email }],
    async () => await getProfileByEmail(email),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );
};

export const useSearchProfile = (keyword: string) => {
  return useQuery(
    ["searchProfile", { id: keyword }],
    async () => await searchProfile(keyword),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );
};
