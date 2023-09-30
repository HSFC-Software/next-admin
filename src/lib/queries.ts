import { useQuery } from "react-query";
import {
  Profile,
  getConsolidators,
  getDisciples,
  getProfileByEmail,
  getRecentConsolidation,
  getVips,
  searchProfile,
  getApplicationList,
  getCourses,
  getSchoolRegistrationByReference,
  getStudentList,
} from "./api";
import jwt from "jsonwebtoken";
export const useGetVips = (status?: "ASSIGNED" | "PENDING") => {
  return useQuery(["getVips", { status }], async () => await getVips(status), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

export const useGetConsolidators = (q: string) => {
  return useQuery(
    ["getConsolidators", { q }],
    async () => await getConsolidators(q),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );
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

export const useGetRecentConsolidation = (id: string) => {
  return useQuery(
    ["getRecentConsolidation", { id }],
    async () => await getRecentConsolidation(id),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );
};

export const useGetApplicationList = () =>
  useQuery(["getApplicationList"], async () => await getApplicationList(), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });

export const useGetCourses = () =>
  useQuery(["getCourses"], async () => await getCourses(), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });

export const useGetSchoolRegistrationByReference = (reference: string) =>
  useQuery(
    ["getSchoolRegistrationByReference", { reference }],
    async () => await getSchoolRegistrationByReference(reference),
    {
      staleTime: 1000 * 60 * 5,
      enabled: true,
    }
  );

export const useGetStudentList = () =>
  useQuery(["getStudentList"], async () => await getStudentList(), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
