import { useQuery } from "react-query";
import {
  getConsolidators,
  getDisciples,
  getProfileByEmail,
  getVips,
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

  type Profile = {
    id: string;
    created_at: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    gender?: string;
    address?: string;
    contact_number?: string;
    birthday?: string;
    is_deleted?: boolean;
    email: string;
    sex?: string;
    status?: "Active" | "Inactive";
    img_url?: string;
  };

  return useQuery<Profile | null>(
    ["getProfile", { email }],
    async () => await getProfileByEmail(email),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );
};
