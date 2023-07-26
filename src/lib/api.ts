import { edgeFunction } from "./axios";
import request from "axios";

export type NewVipPayload = {
  first_name: string;
  last_name: string;
  contact_number: string;
};

export const newVip = async (payload: NewVipPayload) => {
  try {
    const { data } = await edgeFunction.post(`/profile`, {
      ...payload,
      isVip: true,
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const signIn = async (token: string) => {
  try {
    const { data } = await edgeFunction.post(
      `/auth`,
      {},
      {
        headers: {
          "X-Authorization-Key": token,
        },
      }
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const sendBulkSms = async (
  text: string,
  receivers: string[],
  sender: string
) => {
  try {
    const { data } = await request.post("/api/sms", {
      text,
      receivers,
      sender,
    });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getVips = async (status?: "ASSIGNED" | "PENDING") => {
  let endpoint = "/v2/vips";
  if (status) {
    endpoint = `/v2/vips?status=${status}`;
  }

  let response, error;

  response = await edgeFunction
    .get(endpoint) //
    .catch((err) => (error = err));

  if (error) {
    return Promise.reject(error);
  }

  return response.data;
};

export const getConsolidators = async (q: string) => {
  try {
    const { data } = await edgeFunction.get(`/v2/consolidators?q=${q}`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getDisciples = async (q: string) => {
  try {
    const { data } = await edgeFunction.get(`/v2/disciples?q=${q}`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export const getProfileByEmail = async (email: string) => {
  try {
    const { data } = await edgeFunction.get("/profile", { params: { email } });
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export type Profile = {
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

export type SearchedProfile = Pick<
  Profile,
  "id" | "first_name" | "last_name" | "img_url"
>;

export const searchProfile = async (
  keyword: string
): Promise<SearchedProfile[]> => {
  if (!keyword) return Promise.reject("No keyword provided");
  try {
    const { data } = await edgeFunction.get(`/v2/disciples?q=${keyword}`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export type AssignConsolidatorType = {
  disciple_id: string;
  consolidator_id: string;
};

export const assignConsolidator = async (payload: AssignConsolidatorType) => {
  try {
    const { data } = await edgeFunction.post(`/v2/consolidators`, payload);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export type UpdateConsolidatorPayload = {
  consolidator_id: string;
};

export const updateConsolidator = async (
  id: string,
  payload: UpdateConsolidatorPayload
) => {
  try {
    const { data } = await edgeFunction.patch(
      `/v2/consolidators/${id}`,
      payload
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};

export type RecentResponse = {
  created_at: string;
  id: string;
  lesson_code: {
    name: string;
    code: string;
  };
  status: string;
};

export const getRecentConsolidation = async (id: string) => {
  try {
    const { data } = await edgeFunction.get(`/v2/consolidators/recent/${id}`);
    return data as RecentResponse;
  } catch (err) {
    return Promise.reject(err);
  }
};
