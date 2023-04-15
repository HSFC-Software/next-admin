import { edgeFunction } from "./axios";

export type NewVipPayload = {
  first_name: string;
  last_name: string;
  contact_number: string;
};

export const newVip = async (payload: NewVipPayload) => {
  try {
    const { data } = await edgeFunction.post(
      `/profile`,
      {
        ...payload,
        isVip: true,
      },
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbnJ3bW1vbGNiaGduY3dvZ294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ3MzM1MTAsImV4cCI6MTk5MDMwOTUxMH0.Vgv78ZxFTJQ1Dl7pCn352dE_TfE_cveRLqEB7pa_w4s", // test-token
        },
      }
    );
    return data;
  } catch (err) {
    return Promise.reject(err);
  }
};
