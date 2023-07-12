// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  axios
    .post("https://semaphore.co/api/v4/messages", {
      apikey: process.env.SEMAPHORE_API_KEY,
      number: req.body.receivers?.join(","),
      message: req.body.text,
      sendername: req.body?.sender || "SEMAPHORE",
    })
    .then((response) => {
      // send notification to discord bot
      res.status(200).json(response.data);
    })
    .catch((err) => {
      res.status(404).json({});
    });
}
