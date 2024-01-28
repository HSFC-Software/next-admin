import Layout from "@/components/layout";
import {
  ApplicationType,
  enrollStudent,
  getSchoolRegistrationByReference,
} from "@/lib/api";
import {
  useGetBatchList,
  useGetCourses,
  useGetEnrollmentTransactions,
} from "@/lib/queries";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Tabs } from ".";
import Swal from "sweetalert2";
import moment from "moment";
import { useQueryClient } from "react-query";
import { supabase } from "@/lib/supabase";

const Php = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "PHP",
});

export default function School() {
  const queryClient = useQueryClient();

  const { data: batch } = useGetBatchList();
  const { data: courses } = useGetCourses();
  const { data: transactions } = useGetEnrollmentTransactions();

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("All");

  useEffect(() => {
    if (!selectedBatchId && batch?.length) {
      setSelectedBatchId(batch[0].id);
    }
  }, [batch, selectedBatchId]);

  useEffect(() => {
    const listener = supabase
      .channel("table-db-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "enrollment_transactions" },
        () => queryClient.invalidateQueries(["getEnrollmentTransactions"])
      )
      .subscribe();

    return () => {
      listener.unsubscribe();
    };
  }, []);

  let total = 0;

  const filteredTransactions = transactions?.filter((item: any) => {
    const batchId = item.school_registration_id.school_batch.id;
    const courseId = item.school_registration_id.courses.id;

    if (selectedBatchId === batchId) {
      if (selectedCourseId !== "All") {
        if (courseId !== selectedCourseId) return false;
      }

      const amount = item.transactions.amount;
      total += amount;

      return true;
    }

    return false;
  });

  return (
    <>
      <Head>
        <title>School</title>
        <meta name="description" content="Consolidation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout activeRoute="school">
        <div className="flex items-center gap-4 mb-7">
          <h1 className="text-4xl font-bold flex items-center gap-3">School</h1>
        </div>
        <Tabs activeTabKey="accounting" />
        <div className="py-7 text-sm flex gap-4 items-center justify-between pr-2">
          <div className="flex gap-4">
            <div className="flex gap-2">
              <span className="font-medium">Batch</span>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
              >
                {batch?.map((b) => {
                  return (
                    <option value={b.id} key={b.id}>
                      {b.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="flex gap-2">
              <span className="font-medium">Course</span>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value={undefined}>All</option>
                {courses?.map((c) => {
                  return (
                    <option value={c.id} key={c.id}>
                      {c.title}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div>
            <button
            onClick={() => setShowEnrollment(true)}
            className="text-sm bg-[#6474dc] text-white px-5 rounded-lg py-1"
          >
            Enroll
          </button>
          {showEnrollment && (
            <Enrollment onClose={() => setShowEnrollment(false)} />
            Total: <strong>{Php.format(total)}</strong>
          </div>
        </div>
        <table className="table-auto w-full mt-4 text-sm">
          <thead>
            <tr className="bg-[#f4f7fa]">
              <td className="py-2 pl-2 font-bold text-[#6d8297] rounded-l-xl"></td>
              <td className="py-2 font-bold text-[#6d8297]">Course</td>
              <td className="py-2 font-bold text-[#6d8297]">Batch</td>
              <td className="py-2 font-bold text-[#6d8297]">Student</td>
              <td className="py-2 font-bold text-[#6d8297]">Amount</td>
              <td className="py-2 font-bold text-[#6d8297]">
                Transaction Date
              </td>
              <td className="py-2 pl-2 rounded-r-xl"></td>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions?.map((item: any, index) => {
              const isLast = index === filteredTransactions.length - 1;
              return (
                <tr
                  key={item.id}
                  className={`cursor-pointer hover:border-[transparent] hover:bg-[#f4f7fa] border-0 ${
                    isLast ? "border-0" : "border-b"
                  }`}
                >
                  <td className="py-2 pl-2 rounded-l-xl"></td>
                  <td className="py-2">
                    {item.school_registration_id.courses.title}
                  </td>
                  <td className="py-2">
                    {item.school_registration_id.school_batch.name}
                  </td>
                  <td className="py-2">
                    {item.school_registration_id.first_name}{" "}
                    {item.school_registration_id.last_name}
                  </td>
                  <td className="py-2">
                    Php {Number(item.transactions.amount || 0).toFixed(2)}
                  </td>
                  <td className="py-2">
                    {moment(item.created_at).format("MMM DD, YY hh:mm A")}
                  </td>
                  <td className="py-2 pl-2 rounded-r-xl " />
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
    </>
  );
}

type EnrollmentProps = {
  onClose: () => void;
};
function Enrollment(props: EnrollmentProps) {
  const queryClient = useQueryClient();

  const { data: courses } = useGetCourses();
  const [registration, setRegistration] = useState<ApplicationType | null>(
    null
  );

  type CourseTable = {
    [key: string]: {
      title: string;
      fee: string;
      id: string;
    };
  };
  const courseTable: CourseTable = {};

  courses?.forEach((course) => {
    courseTable[course.id] = {
      title: course.title,
      fee: course.fee,
      id: course.id,
    };
  });

  const handleSubmit = (e: any) => {
    const el = document.getElementById(
      "registrationReference"
    ) as HTMLInputElement;
    const reference = el.value;

    e.target.disabled = true;

    getSchoolRegistrationByReference(reference)
      .then((data) => {
        setRegistration(data as unknown as ApplicationType);
      })
      .catch((err) => {
        document.getElementById("not-found")?.classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("not-found")?.classList.add("hidden");
        }, 1500);
      })
      .finally(() => {
        e.target.disabled = false;
      });
  };

  const handleEnroll = (e: any) => {
    if (!registration) return;

    e.target.disabled = true;

    enrollStudent(registration?.id)
      .then(() => {
        Swal.fire({
          title: "Student enrolled!",
          icon: "success",
          confirmButtonColor: "#6474dc",
          confirmButtonText: "Close",
        }).then(async (result) => {
          props.onClose();
          queryClient.invalidateQueries(["getEnrollmentTransactions"]);
        });
      })
      .finally(() => {
        e.target.disabled = false;
      });
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-[#0000004d] flex items-center justify-center">
      <div className="p-7 bg-white rounded-2xl relative w-[595px]">
        <button
          onClick={props.onClose}
          className="absolute right-0 top-0 p-7 text-xs text-[#6474dc]"
        >
          Close
        </button>

        {!registration ? (
          <header className="text-xl font-medium mb-4">Enroll</header>
        ) : (
          <header className="text-xl font-medium mb-4">
            {registration?.first_name} {registration?.middle_name}{" "}
            {registration?.last_name}
          </header>
        )}

        {registration && (
          <div className="w-[539px] text-sm grid grid-cols-2 mt-7 [&>div]:py-2 [&>div]:border-b-[.5px]">
            <div>Course</div>
            <div>{courseTable[registration.course_id]?.title}</div>
            <div>Leader</div>
            <div>{registration.cell_leader_name}</div>
            <div>Network Leader</div>
            <div>{registration.network_leader_name}</div>
            <div>Consolidation Level</div>
            <div>{registration.lesson_completed || "N/A"}</div>
            <div>On the Job Training</div>
            <div>{registration.ojt || "N/A"}</div>
            <div>Do have cellgroup</div>
            <div>{registration.with_cellgroup ? "✅" : "❌"}</div>
            <div>Want to Admin or Teacher</div>
            <div>{registration.want_to_be_admin_or_teacher ? "✅" : "❌"}</div>
            <div>Role</div>
            <div>{registration.role || "N/A"}</div>
            <div className="font-semibold text-green-500">
              Amount to receive
            </div>
            <div className="font-semibold text-green-500">
              Php {String(courseTable[registration.course_id].fee)}
            </div>
          </div>
        )}

        {!registration && (
          <div className="flex items-center gap-2">
            <span className="shrink-0">Enter Enrollment Reference: </span>
            <input
              id="registrationReference"
              autoFocus
              placeholder="Eg: nVb3h"
              className="w-full py-3 outline-0 font-semibold"
            />
          </div>
        )}
        <div id="not-found" className="text-gray-500 text-sm mb-7 hidden">
          <header>Record not found</header>
        </div>

        {registration ? (
          <button
            onClick={handleEnroll}
            className="bg-[#6474dc] text-white px-5 rounded-lg py-2 mt-7 disabled:opacity-50"
          >
            Payment Received
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-[#6474dc] text-white px-5 rounded-lg py-2 mt-4 disabled:opacity-50"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
