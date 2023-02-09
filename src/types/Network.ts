import { Disciple } from "@/types/Disciples";

export type Network = {
  id: string;
  name: string;
  created_at: string;
  is_deleted: boolean;
  discipler_id?: Disciple;
  member_count: number;
};
