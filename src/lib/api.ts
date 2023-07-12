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

export const getConsolidators = async () => {
  try {
    const { data } = await edgeFunction.get(`/v2/consolidators`);
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};
