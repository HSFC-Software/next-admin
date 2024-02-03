import { edgeFunction } from "./axios";
import request from "axios";
import { supabase } from "@/lib/supabase";

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

export type ApplicationType = {
  birthday: string;
  cell_leader_name: string;
  contact_number: string;
  course_id: string;
  created_at: string;
  first_name: string;
  id: string;
  last_name: string;
  lesson_completed: string;
  middle_name: string;
  network_leader_name: string;
  ojt: string;
  reference: string;
  role: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ENROLLED";
  want_to_be_admin_or_teacher: boolean;
  with_cellgroup: boolean;
};

export type ApplicationTypeRequest = {
  startDate: Date;
  endDate: Date;
};

export const getApplicationList = async (payload: ApplicationTypeRequest) => {
  const startDateString = payload.startDate.toISOString();
  const endDateString = payload.endDate.toISOString();

  const { data, error } = await supabase //
    .from("school_registrations")
    .select("*, course_id")
    .lte("created_at", endDateString)
    .gte("created_at", startDateString)
    .order("created_at", { ascending: false })
    .or(
      "status.eq.PENDING,status.eq.APPROVED,status.eq.REJECTED,status.eq.ENROLLED"
    );

  if (error) return Promise.reject(error);
  return data as ApplicationType[];
};

export const getCourses = async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("id, title, fee");

  if (error) return Promise.reject(error);
  return data;
};

export const updateApplication = async (payload: {
  id: string;
  status: "APPROVED" | "REJECTED";
  learner_id?: string;
  batch_id?: string;
}) => {
  const id = payload.id;

  const body: Partial<typeof payload> = {
    status: payload.status,
  };

  if (payload.learner_id) body.learner_id = payload.learner_id;
  if (payload.batch_id) body.batch_id = payload.batch_id;

  const { data, error } = await supabase
    .from("school_registrations")
    .update(body)
    .eq("id", id)
    .select(
      "id, course_id, first_name, status, reference, middle_name, last_name, contact_number, cell_leader_name, network_leader_name, lesson_completed, ojt, with_cellgroup, want_to_be_admin_or_teacher, role, birthday, batch_id, learner_id"
    )
    .single();

  if (error) return Promise.reject(error);
  return data as any;
};

export const getSchoolRegistrationByReference = async (reference: string) => {
  const { data, error } = await supabase
    .from("school_registrations")
    .select(
      "id, course_id, first_name, status, reference, middle_name, last_name, contact_number, cell_leader_name, network_leader_name, lesson_completed, ojt, with_cellgroup, want_to_be_admin_or_teacher, role, birthday, batch_id, learner_id"
    )
    .eq("reference", reference)
    .eq("status", "APPROVED")
    .single();

  if (error) return Promise.reject(error);
  return data;
};

type IncludeStudentToBatchPayload = {
  learner_id: string;
  batch_id: string;
  course_id: string;
};

export const includeStudentToBatch = async (
  payload: IncludeStudentToBatchPayload
) => {
  const { data, error } = await supabase //
    .from("school_masterlist")
    .insert({
      learner_id: payload.learner_id,
      batch_id: payload.batch_id,
      course_id: payload.course_id,
    });

  if (error) return Promise.reject(error);
  return data;
};

type TransactionPayload = {
  course_id: string;
  registration_id: string;
};

export const createEnrollmentPaymentTransaction = async (
  payload: TransactionPayload
) => {
  const { course_id, registration_id } = payload;

  const { data: course } = await supabase
    .from("courses")
    .select("fee")
    .eq("id", course_id)
    .single();

  const fee = course?.fee;

  const { data: transaction } = await supabase
    .from("transactions")
    .insert({
      amount: fee,
      direction_type: "RECEIVE",
    })
    .select("id")
    .single();

  await supabase.from("enrollment_transactions").insert({
    transaction_id: transaction?.id,
    school_registration_id: registration_id,
  });
};

export const enrollStudent = async (registration_id: string) => {
  const { data, error } = await supabase
    .from("school_registrations")
    .update({ status: "ENROLLED" })
    .eq("id", registration_id)
    .select(
      "id, course_id, first_name, status, reference, middle_name, last_name, contact_number, cell_leader_name, network_leader_name, lesson_completed, ojt, with_cellgroup, want_to_be_admin_or_teacher, role, birthday, batch_id, learner_id"
    )
    .single();

  if (error) return Promise.reject(error);

  await includeStudentToBatch({
    learner_id: data.learner_id,
    batch_id: data.batch_id,
    course_id: data.course_id,
  });

  await createEnrollmentPaymentTransaction({
    course_id: data.course_id,
    registration_id,
  });

  // todo: send sms
  const { data: course } = await supabase
    .from("courses")
    .select("id, title")
    .eq("id", data.course_id)
    .single();

  const { data: batch } = await supabase
    .from("school_batch")
    .select("name")
    .eq("id", data.batch_id)
    .single();

  let name = data.first_name;

  name = name.toLowerCase();
  name = name.replace(/^./, (str: string) => str.toUpperCase());

  let lastName = data.last_name;
  lastName = lastName.toLowerCase();
  lastName = lastName.replace(/^./, (str: string) => str.toUpperCase());

  if (name) name += " ";
  name += lastName;

  const message = `Congratulations ${name}! you have been enrolled to ${course?.title} (${batch?.name})`;
  sendBulkSms(message, ["09951104834"], "HSFCTaytay");

  return data;
};

type StudentRecord = {
  first_name: string;
  last_name: string;
  middle_name: string;
  level_id?: string;
};
export const hasDuplicateStudentRecord = async (
  payload: StudentRecord
): Promise<boolean> => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("first_name", payload.first_name)
    .eq("last_name", payload.last_name)
    .eq("middle_name", payload.middle_name)
    .single();

  if (error) return false;
  if (data) return true;

  return false;
};

export const createStudentRecord = async (payload: StudentRecord) => {
  const { data, error } = await supabase
    .from("students")
    .insert(payload)
    .select("id, sequence_id, learner_id")
    .single();

  if (error) {
    return Promise.reject(error);
  }

  // learner id format: 4172825-23-0001
  const schoolId = "4172825";
  const year = new Date().getFullYear().toString().substr(2, 2);
  const sequenceId = data.sequence_id.toString().padStart(4, "0");

  const learnerId = `${schoolId}${year}${sequenceId}`;

  const { data: updated } = await supabase
    .from("students")
    .update({ learner_id: learnerId })
    .eq("id", data.id)
    .select("id, sequence_id, learner_id")
    .single();

  return updated;
};

export const getStudentList = async () => {
  const { data, error } = await supabase //
    .from("students")
    .select(
      "first_name, last_name, middle_name, learner_id, id, ongoing_course"
    )
    .order("created_at", { ascending: false });

  if (error) return Promise.reject(error);

  return data;
};

export const getBatchList = async () => {
  const { data, error } = await supabase //
    .from("school_batch")
    .select("id, name, description, created_at")
    .order("created_at", { ascending: false });

  if (error) return Promise.reject(error);
  return data;
};

type GetStudentsByBatchQuery = {
  batch_id?: string;
};

export const getStudentsByBatch = async (q: GetStudentsByBatchQuery) => {
  let query = supabase //
    .from("school_masterlist").select(`
      school_batch(id, name),
      students(id, first_name, middle_name, last_name),
      courses(id, title),
      created_at,
      id
    `);

  if (q.batch_id) {
    query = query.eq("batch_id", q.batch_id);
  }

  query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) return Promise.reject(error);
  return data;
};

export const getEnrollmentTransactions = async () => {
  const { data, error } = await supabase
    .from("enrollment_transactions")
    .select(
      `
      id,
      created_at,
      school_registration_id(
        id,
        first_name,
        last_name,
        middle_name,
        school_batch!school_registrations_batch_id_fkey(
          id,
          name
        ),
        courses!school_registrations_course_id_fkey(
          id,
          title
        )
      ),
      transactions(
        id,
        amount
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) return Promise.reject(error);
  return data;
};
