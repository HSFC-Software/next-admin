import Layout from "@/components/layout";
import axios from "@/lib/axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { RiCloseCircleFill, RiArrowRightLine, RiLink } from "react-icons/ri";
import { PiUserBold } from "react-icons/pi";

import debounce from "lodash.debounce";
import moment, { Moment } from "moment";
import { IoCaretUpOutline, IoCaretDownOutline } from "react-icons/io5";
import $ from "jquery";
import "daterangepicker";
import {
  useGetConsolidators,
  useGetRecentConsolidation,
  useSearchProfile,
} from "@/lib/queries";
import { useDebounce } from "@/lib/hooks";
import { useAssignConsolidator, useUpdateConsolidator } from "@/lib/mutation";
import { useRouter } from "next/router";

type Disciples = {
  id: string;
  first_name: string;
  last_name: string;
  img_url: string;
};

export type Consolidators = {
  id: string;
  created_at: string;
  disciples_id: Disciples;
  is_deleted: boolean;
  consolidators_lesson: string[];
};

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  img_url: string;
};

type Consolidations = {
  id: string;
  consolidator_id: Profile;
  disciple_id: Profile;
  created_at?: string;
  is_deleted: boolean;
  lesson_code?: {
    name: string;
    code: string;
  };
};

type Order = "asc" | "desc";

export default function Consolidations() {
  const router = useRouter();

  const { mutate: assignConsolidator, isLoading } = useAssignConsolidator();

  const [searchQ, setSearchQ] = useState("");
  const debouncedSearchQ = useDebounce(searchQ, 500);
  const { data: consolidations } = useGetConsolidators(debouncedSearchQ ?? "");

  const [order, setOrder] = useState<Order>("desc");
  const [sortBy, setSortBy] = useState("created_at");

  const [q, setQ] = useState("");
  const debouncedSearch = useDebounce(q, 500);
  const [consolidator, setConsolidator] = useState("");
  const [disciple, setDisciple] = useState("");

  const [selectedUpdate, setSelectedUpdate] = useState<Consolidations | null>(
    null
  );
  const [selectedConso, setSelectedConso] = useState<Profile | null>(null);
  const [selectedDisciple, setSelectedDisciple] = useState<Profile | null>(
    null
  );

  const [showAssignPrompt, setShowAssignPrompt] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const { data: queryResult } = useSearchProfile(debouncedSearch);

  const [searchBy, setSearchBy] = useState<"consolidator" | "disciple">(
    "consolidator"
  );

  const { mutate: updateConsolidator, isLoading: isUpdating } =
    useUpdateConsolidator(selectedUpdate?.id ?? "", searchQ);

  const handleSearchConsolidator = (e: any) => {
    setQ(e?.target?.value);
    setConsolidator(e?.target?.value);
    setSearchBy("consolidator");
  };

  const handleSearchDisciple = (e: any) => {
    setSearchBy("disciple");
    setDisciple(e?.target?.value);
    setQ(e?.target?.value);
  };

  const handleSelectConsolidator = (data: any) => {
    setSelectedConso(data);
    setConsolidator(`${data.first_name} ${data.last_name}`);
    setQ("");
  };

  const handleSelectDisciple = (data: any) => {
    setSelectedDisciple(data);
    setDisciple(`${data.first_name} ${data.last_name}`);
    setQ("");
  };

  const handleAssign = () => {
    document?.getElementById?.("consolidator-input")?.focus();
    if (!selectedConso || !selectedDisciple) {
      if (!selectedConso)
        document?.getElementById?.("consolidator-input")?.focus?.();

      if (!selectedDisciple)
        document?.getElementById?.("disciple-input")?.focus?.();

      return;
    }

    assignConsolidator(
      {
        disciple_id: (selectedDisciple as any).id,
        consolidator_id: (selectedConso as any).id,
      },
      {
        onSuccess() {
          setShowAssignPrompt(false);
          setSelectedConso(null);
          setSelectedDisciple(null);
          setConsolidator("");
          setDisciple("");

          if (router.query?.assignTo) {
            router.push("/vips");
          }
        },
      }
    );
  };

  useEffect(() => {
    if (router.query?.assignTo) {
      const name = String(router.query.name).trim();
      setDisciple(name);
      setSelectedDisciple({
        id: router.query.assignTo,
      } as any);
      setShowAssignPrompt(true);
    }
  }, []);

  const handleCloseAssignPrompt = () => {
    if (router.query?.assignTo) {
      router.push("/vips");
    }

    setShowAssignPrompt(false);
  };

  const handleCloseUpdatePrompt = () => {
    setSelectedConso(null);
    setSelectedDisciple(null);
    setConsolidator("");
    setDisciple("");
    setShowUpdatePrompt(false);
  };

  const handleOpenUpdatePrompt = (data: Consolidations) => {
    setSelectedUpdate(data);

    setSelectedConso({
      id: data.consolidator_id.id,
      first_name: data.consolidator_id.first_name,
      last_name: data.consolidator_id.last_name,
      img_url: data.consolidator_id.img_url,
    });

    setSelectedDisciple({
      id: data.disciple_id.id,
      first_name: data.disciple_id.first_name,
      last_name: data.disciple_id.last_name,
      img_url: data.disciple_id.img_url,
    });

    setShowUpdatePrompt(true);
    setConsolidator(
      `${data.consolidator_id.first_name} ${data.consolidator_id.last_name}`
    );
    setDisciple(`${data.disciple_id.first_name} ${data.disciple_id.last_name}`);
  };

  const handleUpdate = () => {
    if (isUpdating) return;
    if (!selectedConso) return;

    updateConsolidator(
      {
        consolidator_id: selectedConso.id,
      },
      {
        onSuccess() {
          handleCloseUpdatePrompt();
        },
      }
    );
  };

  return (
    <>
      <Head>
        <title>Consolidation</title>
        <meta name="description" content="Consolidation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          type="text/javascript"
          src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"
        ></script>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css"
        />
      </Head>
      <Layout activeRoute="consolidations">
        <div className="flex items-center gap-4 mb-7">
          <h1 className="text-4xl font-bold">Consolidations</h1>
          <button
            className="gap-1 flex text-sm items-center underline text-[#6474dc]"
            onClick={() => setShowAssignPrompt(true)}
          >
            Assign
            <RiLink size={16} />
          </button>
        </div>
        <div className="flex gap-2">
          <input
            id="search-input"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            name="search"
            placeholder="Search by Consolidator's or Disciple's name"
            className="px-3 py-2 border-2 rounded-lg text-sm w-full"
          />
        </div>

        {!searchQ.length && (
          <div className="mt-4 text-right text-gray-500 text-sm">
            Unable to find record?{" "}
            <button
              onClick={() => document.getElementById("search-input")?.focus?.()}
              className="underline text-[#6474dc]"
            >
              Search one instead.
            </button>
          </div>
        )}

        <table className="table-auto w-full text-sm mt-4">
          <thead>
            <tr className="bg-[#f4f7fa] cursor-pointer">
              <td className="py-2 pl-2 rounded-l-lg">
                {/* <div className="border-2 rounded-md w-[21px] h-[21px] bg-white cursor-pointer" /> */}
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle order={order} name="lesson_code">
                  Lesson
                </ColumnTitle>
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle order={order} name="">
                  Consolidator
                </ColumnTitle>
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle order={order} name="">
                  Disciple
                </ColumnTitle>
              </td>

              <td className="py-2 font-bold text-[#6d8297] rounded-r-lg">
                <ColumnTitle order={order} name="created_at">
                  Recent Conso Date
                </ColumnTitle>
              </td>
            </tr>
          </thead>
          <tbody>
            {consolidations?.map((item: Consolidations, index: number) => {
              const isLast = consolidations.length - 1 === index;
              return (
                <tr
                  onClick={() => {
                    console.log(item);
                    handleOpenUpdatePrompt(item);
                  }}
                  key={item.id}
                  className={`cursor-pointer hover:border-[transparent] hover:bg-[#f4f7fa] ${
                    isLast ? "" : "border-b"
                  }`}
                >
                  <td className="py-2 rounded-l-lg"></td>
                  <Lesson id={item.id} />
                  <td className="py-2">
                    <div className="flex gap-2 items-center">
                      <div className="text-[#6474dc] text-lg bg-gray-200 h-7 w-7 rounded-full shrink-0 overflow-hidden border-2 border-[#6474dc] flex items-center justify-center">
                        {item.consolidator_id.img_url ? (
                          <img
                            src={item.consolidator_id.img_url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PiUserBold />
                        )}
                      </div>
                      <span>
                        {item.consolidator_id.first_name ?? ""}{" "}
                        {item.consolidator_id?.last_name ?? ""}
                      </span>
                    </div>
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2 items-center">
                      <div className="text-[#6474dc] text-lg bg-gray-200 h-7 w-7 rounded-full shrink-0 overflow-hidden border-2 border-[#6474dc] flex items-center justify-center">
                        {item.disciple_id.img_url ? (
                          <img
                            src={item.disciple_id.img_url}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <PiUserBold />
                        )}
                      </div>
                      <span>
                        {item.disciple_id.first_name ?? ""}{" "}
                        {item.disciple_id?.last_name ?? ""}
                      </span>
                    </div>
                  </td>
                  <RecentDate id={item.id} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
      {showAssignPrompt && (
        <div className="fixed top-0 w-screen h-screen bg-[#3c4151b3] z-10">
          <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white rounded-2xl w-[650px] relative p-7">
              <div className="absolute top-0 right-0 p-4 text-2xl text-gray-600">
                <button onClick={handleCloseAssignPrompt}>
                  <RiCloseCircleFill />
                </button>
              </div>
              <header className="font-bold text-2xl text-[#3c4151]">
                Assign
              </header>
              <div className="mt-4 flex items-center gap-4 pt-5">
                <div className="relative grow">
                  <label className="absolute top-[-20px]">Consolidator</label>
                  <input
                    disabled={isLoading}
                    id="consolidator-input"
                    onFocus={() => setSearchBy("consolidator")}
                    value={consolidator}
                    onChange={handleSearchConsolidator}
                    placeholder="Type to search"
                    className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                  />
                  {searchBy === "consolidator" && !!queryResult?.length && (
                    <div className="w-full overflow-y-auto max-h-[175px] flex flex-col py-2 absolute bg-[#f4f7fa] mt-2 rounded-lg shadow-lg">
                      {queryResult?.map((item) => {
                        return (
                          <li
                            onClick={() => handleSelectConsolidator(item)}
                            key={item.id}
                            className="hover:bg-gray-200 flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                          >
                            <div className="text-[#6474dc] text-lg bg-gray-200 h-9 w-9 rounded-full shrink-0 overflow-hidden border-2 border-[#6474dc] flex items-center justify-center">
                              {item.img_url ? (
                                <img
                                  src={item.img_url}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PiUserBold />
                              )}
                            </div>
                            <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                              {item.first_name} {item.last_name}
                            </span>
                          </li>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="text-gray-500 text-2xl mt-2">
                  <RiArrowRightLine />
                </div>
                <div className="relative grow">
                  <label className="absolute top-[-20px]">Disciple</label>
                  <input
                    disabled={isLoading}
                    id="disciple-input"
                    onFocus={() => setSearchBy("disciple")}
                    value={disciple}
                    onChange={handleSearchDisciple}
                    placeholder="Type to search"
                    className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                  />
                  {searchBy === "disciple" && !!queryResult?.length && (
                    <div className="w-full overflow-y-auto max-h-[175px] flex flex-col py-2 absolute bg-[#f4f7fa] mt-2 rounded-lg shadow-lg">
                      {queryResult
                        ?.filter(
                          (item) => item?.id !== (selectedConso as any)?.id
                        )
                        ?.map((item) => {
                          return (
                            <li
                              onClick={() => handleSelectDisciple(item)}
                              key={item.id}
                              className="hover:bg-gray-200 flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                            >
                              <div className="text-[#6474dc] text-lg bg-gray-200 h-9 w-9 rounded-full shrink-0 overflow-hidden border-2 border-[#6474dc] flex items-center justify-center">
                                {item.img_url ? (
                                  <img
                                    src={item.img_url}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <PiUserBold />
                                )}
                              </div>
                              <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                                {item.first_name} {item.last_name}
                              </span>
                            </li>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    disabled={isLoading}
                    onClick={handleAssign}
                    className="grow gap-2 flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
                  >
                    Assign now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpdatePrompt && (
        <div className="fixed top-0 w-screen h-screen bg-[#3c4151b3] z-10">
          <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white rounded-2xl w-[650px] relative p-7">
              <div className="absolute top-0 right-0 p-4 text-2xl text-gray-600">
                <button onClick={handleCloseUpdatePrompt}>
                  <RiCloseCircleFill />
                </button>
              </div>
              <header className="font-bold text-2xl text-[#3c4151]">
                Update Consolidator
              </header>
              <div className="mt-4 flex items-center gap-4 pt-5">
                <div className="relative grow">
                  <label className="absolute top-[-20px]">Consolidator</label>
                  <input
                    disabled={isUpdating}
                    id="consolidator-input"
                    onFocus={() => setSearchBy("consolidator")}
                    value={consolidator}
                    onChange={handleSearchConsolidator}
                    placeholder="Type to search"
                    className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                  />
                  {searchBy === "consolidator" && !!queryResult?.length && (
                    <div className="w-full overflow-y-auto max-h-[175px] flex flex-col py-2 absolute bg-[#f4f7fa] mt-2 rounded-lg shadow-lg">
                      {queryResult?.map((item) => {
                        return (
                          <li
                            onClick={() => handleSelectConsolidator(item)}
                            key={item.id}
                            className="hover:bg-gray-200 flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                          >
                            <div className="text-[#6474dc] text-lg bg-gray-200 h-9 w-9 rounded-full shrink-0 overflow-hidden border-2 border-[#6474dc] flex items-center justify-center">
                              {item.img_url ? (
                                <img
                                  src={item.img_url}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <PiUserBold />
                              )}
                            </div>
                            <span className="overflow-ellipsis whitespace-nowrap overflow-hidden">
                              {item.first_name} {item.last_name}
                            </span>
                          </li>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="text-gray-500 text-2xl mt-2">
                  <RiArrowRightLine />
                </div>
                <div className="relative grow">
                  <label className="absolute top-[-20px]">Disciple</label>
                  <input
                    disabled
                    readOnly
                    id="update-disciple-input"
                    onFocus={() => setSearchBy("disciple")}
                    value={disciple}
                    onChange={handleSearchDisciple}
                    placeholder="Type to search"
                    className="cursor-not-allowed opacity-40 w-full px-4 py-2 border-2 rounded-2xl mt-2"
                  />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={handleUpdate}
                    className="grow gap-2 flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
                  >
                    Update now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

type ColumnTitleProps = {
  children: string;
  name?: string;
  order: Order;
  isActive?: boolean;
  onClick?: () => any;
};

function ColumnTitle(props: ColumnTitleProps) {
  const { children, order, name, isActive, onClick } = props;

  let upClass = "opacity-50";
  let downClass = "opacity-50";

  if (isActive) {
    if (order === "asc") {
      upClass = "";
      downClass = "opacity-50";
    } else {
      upClass = "opacity-50";
      downClass = "";
    }
  }

  return (
    <span
      onClick={() => onClick?.()}
      className={`flex items-center gap-1 ${
        name ? "hover:text-gray-700 cursor-pointer" : ""
      }`}
    >
      <span>{children}</span>
      {name && (
        <span className="flex flex-col text-xs text-[#6371de]">
          <span className={`block ${upClass}`}>
            <IoCaretUpOutline size={10} />
          </span>
          <span style={{ marginTop: -2 }} className={`block ${downClass}`}>
            <IoCaretDownOutline size={10} />
          </span>
        </span>
      )}
    </span>
  );
}

type LessonProps = {
  id: string;
};

function Lesson(props: LessonProps) {
  const { data } = useGetRecentConsolidation(props.id);

  return <td className="py-2">{data?.lesson_code?.name ?? "-"}</td>;
}

function RecentDate(props: LessonProps) {
  const { data } = useGetRecentConsolidation(props.id);

  return (
    <td className="py-2 rounded-r-lg">
      {data?.created_at && <>{moment(data?.created_at).format("LLL")}</>}
      {!data?.created_at && "-"}
    </td>
  );
}
