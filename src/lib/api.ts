import { edgeFunction } from "./axios";

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
