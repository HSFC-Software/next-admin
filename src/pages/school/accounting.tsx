import Layout from "@/components/layout";
import {
  ApplicationType,
  enrollStudent,
  getSchoolRegistrationByReference,
} from "@/lib/api";
import { UpdateApplicationPayload, useUpdateApplication } from "@/lib/mutation";
import {
  useGetApplicationList,
  useGetCourses,
  useGetSchoolRegistrationByReference,
} from "@/lib/queries";
import moment from "moment";
import Head from "next/head";
import Link from "next/link";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Tabs } from ".";

export default function School() {
  const [showEnrollment, setShowEnrollment] = useState(false);

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
        <div className="flex justify-between items-center">
          <div className="py-7">
            Transaction Type:{" "}
            <select>
              <option>Enrollment</option>
            </select>
          </div>
          <button
            onClick={() => setShowEnrollment(true)}
            className="text-sm bg-[#6474dc] text-white px-5 rounded-lg py-1"
          >
            Enroll
          </button>
          {showEnrollment && (
            <Enrollment onClose={() => setShowEnrollment(false)} />
          )}
        </div>
      </Layout>
    </>
  );
}

type EnrollmentProps = {
  onClose: () => void;
};
function Enrollment(props: EnrollmentProps) {
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
        setRegistration(data as ApplicationType);
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
      .then((data) => {
        setRegistration(null);
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
