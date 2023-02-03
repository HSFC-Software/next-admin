export type Consolidation = {
  id: string;
  consolidator_id: {
    first_name: string;
    last_name: string;
  };
  disciple_id: {
    first_name: string;
    last_name: string;
  };
  is_deleted: boolean;
  created_at: string;
  lesson_code: string;
};
