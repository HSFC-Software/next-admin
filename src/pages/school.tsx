import Layout from "@/components/layout";
import { ApplicationType } from "@/lib/api";
import { UpdateApplicationPayload, useUpdateApplication } from "@/lib/mutation";
import { useGetApplicationList, useGetCourses } from "@/lib/queries";
import moment from "moment";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

export default function School() {
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
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li className="mr-2">
              <a
                href="#"
                className="inline-flex gap-2 items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
              >
                <span className="text-xl">🏡 </span>
                Dashboard
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className="inline-flex items-center gap-2 justify-center p-4 text-[#6474dc] border-b-2 border-[#6474dc] rounded-t-lg active dark:text-[#6474dc] dark:border-[#6474dc] group"
                aria-current="page"
              >
                <span className="text-xl">🎟️</span>Admission
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className="inline-flex gap-2 items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
              >
                <span className="text-xl">🗃️</span> Master List
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className="inline-flex gap-2 items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
              >
                <span className="text-xl">📑</span> Accounting
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#"
                className="inline-flex gap-2 items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 group"
              >
                <span className="text-xl">🎒</span> Students
              </a>
            </li>
          </ul>
          <Admission />
        </div>
      </Layout>
    </>
  );
}

function Admission() {
  const { data } = useGetApplicationList();
  const { data: courses } = useGetCourses();
  const {
    mutate: updateApplication,
    isLoading: isUpdating,
    isSuccess,
  } = useUpdateApplication();

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

  const [selected, setSelected] = useState<ApplicationType | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = () => {
    if (isUpdating) return;
    setSelected(null);
  };

  useOnClickOutside(modalRef, handleClickOutside);

  const handleAdmit = () => {
    if (!selected) return;

    const studentId = (document.getElementById("studentId") as HTMLInputElement)
      .value;

    const payload: UpdateApplicationPayload = {
      id: selected.id,
      status: "APPROVED",
    };
    if (studentId) payload.student_id = studentId;

    updateApplication(payload);
  };

  const handleReject = () => {
    if (!selected) return;

    const payload: UpdateApplicationPayload = {
      id: selected.id,
      status: "REJECTED",
    };

    updateApplication(payload);
  };

  useEffect(() => {
    function handlePressEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isUpdating) return;
        setSelected(null);
      }
    }

    document.addEventListener("keydown", handlePressEsc);
    return () => {
      document.removeEventListener("keydown", handlePressEsc);
    };
  }, [selected, isUpdating]);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setSelected(null);
      }, 1000);
    }
  }, [isSuccess]);

  return (
    <>
      <table className="table-auto w-full mt-4 text-sm">
        <thead>
          <tr className="bg-[#f4f7fa]">
            <td className="py-2 pl-2 font-bold text-[#6d8297] rounded-l-xl">
              Name
            </td>
            <td className="py-2 font-bold text-[#6d8297]">Course</td>

            <td className="py-2 font-bold text-[#6d8297]">Date Submitted</td>
            <td className="py-2 pl-2 rounded-r-xl"></td>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, index) => {
            const isLast = index === data.length - 1;

            return (
              <tr
                onClick={() => setSelected(item)}
                key={item.id}
                className={`cursor-pointer hover:border-[transparent] hover:bg-[#f4f7fa] border-0 ${
                  isLast ? "border-0" : "border-b"
                }`}
              >
                <td className="py-2 pl-2 rounded-l-xl">
                  {item.first_name} {item.last_name}
                </td>
                <td className="py-2">{courseTable[item.course_id]?.title}</td>
                <td className="py-2">
                  {moment(item.created_at).format("MM DD, YYYY hh:mm A")}
                </td>
                <td className="py-2 pl-2 rounded-r-xl " />
              </tr>
            );
          })}
        </tbody>
      </table>
      {selected && (
        <div className="fixed top-0 left-0 h-screen w-screen bg-[#0000004d] flex items-center justify-center">
          <div ref={modalRef} className="p-7 bg-white rounded-2xl relative">
            {!isUpdating && (
              <button
                onClick={handleClickOutside}
                className="absolute right-0 top-0 p-7 text-xs text-[#6474dc]"
              >
                Close
              </button>
            )}
            <div className="font-semibold text-xl">
              {selected.first_name} {selected.middle_name} {selected.last_name}
            </div>
            <div className="text-sm text-gray-500">
              Submitted: Jun 20, 2023 10:09 PM
            </div>

            <div className="w-[539px] text-sm grid grid-cols-2 mt-7 [&>div]:py-2 [&>div]:border-b-[.5px]">
              <div>Course</div>
              <div>{courseTable[selected.course_id]?.title}</div>
              <div>Leader</div>
              <div>{selected.cell_leader_name}</div>
              <div>Network Leader</div>
              <div>{selected.network_leader_name}</div>
              <div>Consolidation Level</div>
              <div>{selected.lesson_completed || "N/A"}</div>
              <div>On the Job Training</div>
              <div>{selected.ojt || "N/A"}</div>
              <div>Do have cellgroup</div>
              <div>{selected.with_cellgroup ? "✅" : "❌"}</div>
              <div>Want to Admin or Teacher</div>
              <div>{selected.want_to_be_admin_or_teacher ? "✅" : "❌"}</div>
              <div>Role</div>
              <div>{selected.role || "N/A"}</div>
            </div>
            <div className="my-4 flex items-center gap-2">
              <label className="text-xs text-gray-500 font-medium">
                Student ID:
              </label>
              <input
                disabled={isUpdating}
                id="studentId"
                className="grow text-xs py-2 outline-0"
                placeholder="Enter Student ID (Leave blank if none)"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm flex gap-2">
                <button
                  disabled={isUpdating}
                  onClick={handleAdmit}
                  className="disabled:opacity-50 bg-[#6474dc] text-white px-4 py-2 rounded-lg font-medium"
                >
                  Admit
                </button>
                <button
                  disabled={isUpdating}
                  onClick={handleReject}
                  className="disabled:opacity-50 bg-red-400 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Reject
                </button>
              </div>
              {isSuccess && (
                <span className="text-xs text-green-500">Changes Applied</span>
              )}
              {isUpdating && (
                <div className="text-xs text-[#6474dc] flex items-center gap-2">
                  <span>Applying changes</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 38 38"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        x1="8.042%"
                        y1="0%"
                        x2="65.682%"
                        y2="23.865%"
                        id="a"
                      >
                        <stop
                          stop-color="#6474dc"
                          stop-opacity="0"
                          offset="0%"
                        />
                        <stop
                          stop-color="#6474dc"
                          stop-opacity=".631"
                          offset="63.146%"
                        />
                        <stop stop-color="#6474dc" offset="100%" />
                      </linearGradient>
                    </defs>
                    <g fill="none" fill-rule="evenodd">
                      <g transform="translate(1 1)">
                        <path
                          d="M36 18c0-9.94-8.06-18-18-18"
                          id="Oval-2"
                          stroke="url(#a)"
                          stroke-width="2"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                          />
                        </path>
                        <circle fill="#6474dc" cx="36" cy="18" r="1">
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            from="0 18 18"
                            to="360 18 18"
                            dur="0.9s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </g>
                    </g>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
