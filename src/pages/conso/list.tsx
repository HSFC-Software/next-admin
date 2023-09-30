import Layout from "@/components/layout";
import axios from "@/lib/axios";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import debounce from "lodash.debounce";
import moment, { Moment } from "moment";
import { IoCaretUpOutline, IoCaretDownOutline } from "react-icons/io5";
import { RxMixerHorizontal } from "react-icons/rx";
import { BiExport } from "react-icons/bi";
import $ from "jquery";
import "daterangepicker";
import { getServerSidePropsWithAuth } from "@/lib/server";

type Disciples = {
  id: string;
  first_name: string;
  last_name: string;
};

export type Consolidators = {
  id: string;
  created_at: string;
  disciples_id: Disciples;
  is_deleted: boolean;
  consolidators_lesson: string[];
};

type Consolidations = {
  id: string;
  consolidator_id: {
    id: string;
    first_name: string;
    last_name: string;
  };
  disciple_id: {
    id: string;
    first_name: string;
    last_name?: string;
  };
  is_deleted: boolean;
  created_at: string;
  lesson_code: {
    name: string;
    code: string;
  };
};

type Order = "asc" | "desc";

export default function Consolidations() {
  const [consolidations, setConsolidations] = useState<Consolidations[] | null>(
    null
  );

  // filters
  const [order, setOrder] = useState<Order>("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [lesson, setLesson] = useState("");
  const [searchPerson, setSearchPerson] = useState<{
    key: string; // disciple | consolidator
    value: string;
  } | null>(null);
  const [dateRange, setDateRange] = useState<{
    dateStart: Moment;
    dateEnd: Moment;
  } | null>();

  useEffect(() => {
    const queryObject: { [key: string]: string } = {
      sortBy,
      order,
    };

    if (lesson) {
      queryObject.lesson = lesson;
    }

    if (searchPerson) {
      queryObject[searchPerson?.key] = searchPerson?.value;
    }

    if (dateRange) {
      queryObject.dateStart = dateRange.dateStart.utc().toISOString();
      queryObject.dateEnd = dateRange.dateEnd.utc().toISOString();
    }

    const searchParams = new URLSearchParams();
    Object.keys(queryObject).forEach((key) =>
      searchParams.append(key, queryObject[key])
    );

    let q = searchParams.toString();

    axios.get(`/api/consolidations?${q}`).then((res) => {
      setConsolidations(res.data);
    });
  }, [lesson, searchPerson, dateRange, sortBy, order]);

  const [consolidators, setConsolidators] = useState<Consolidators[] | null>(
    null
  );
  const [disciplesSearch, setDisciplesSearch] = useState<Disciples[] | null>(
    null
  );
  const [selectedDisciple, setSelectedDisciple] = useState<Disciples | null>(
    null
  );

  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddingDisciple, setIsAddingDisciple] = useState(false);

  const onKeyPress = () => {
    setDisciplesSearch(null);
  };

  const onChange = debounce((e: any) => {
    axios.get(`/api/disciples?q=${e.target.value}`).then((res) => {
      setDisciplesSearch(res.data);
    });
  }, 1000);

  const handleAddConsolidator = () => {
    setIsAddingDisciple(true);
    axios
      .post("/api/consolidators", { disciples_id: selectedDisciple?.id })
      .finally(() => {
        setIsAddingDisciple(false);
        axios.get("/api/consolidators").then((res) => {
          setConsolidators(res.data);
        });
        setShowAddModal(false);
      });
  };

  // todo: prevent double entry

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
      <Layout activeRoute="conso">
        <div className="flex flex-col gap-4 mb-7">
          <h1 className="text-4xl font-bold">Consolidations</h1>
        </div>
        <div className="flex gap-2">
          <input
            name="search"
            placeholder="Search"
            className="px-3 py-2 border-2 rounded-lg text-sm w-full"
          />
          <button className="flex items-center gap-2 shrink-0 py-2 px-7 rounded-lg text-xs border-2 border-[#6371de] text-[#6371de] font-bold">
            <RxMixerHorizontal />
            <span>Clear Filter</span>
          </button>
          <button className="flex items-center gap-2 shrink-0 py-2 px-7 rounded-lg text-xs border-2 border-[#6371de] text-[#6371de] font-bold">
            <RxMixerHorizontal />
            <span>Show Filter</span>
          </button>
        </div>
        <div className="flex justify-between gap-4 mt-4">
          <Lessons onSelect={(lesson) => setLesson(lesson)} />
          <Person setSearchPerson={setSearchPerson} />
          <DateRange
            onChange={(dateStart, dateEnd) =>
              setDateRange({ dateStart, dateEnd })
            }
          />
          <div className="shrink-0">
            <button className="gap-2 flex justify-center items-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white px-7 rounded-lg hover:shadow-md h-full">
              <span className="text-lg">
                <BiExport />
              </span>
              Export as CSV
            </button>
          </div>
        </div>
        <table className="table-auto w-full text-sm mt-4">
          <thead>
            <tr className="bg-[#f4f7fa]">
              <td className="py-2 pl-2 rounded-l-lg">
                {/* <div className="border-2 rounded-md w-[21px] h-[21px] bg-white cursor-pointer" /> */}
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle
                  isActive={sortBy === "lesson_code"}
                  order={order}
                  name="lesson_code"
                  onClick={() => {
                    if (sortBy === "lesson_code") {
                      if (order === "asc") setOrder("desc");
                      else setOrder("asc");
                    } else {
                      setSortBy("lesson_code");
                    }
                  }}
                >
                  Lesson
                </ColumnTitle>
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle order={order} name="">
                  Disciple
                </ColumnTitle>
              </td>
              <td className="py-2 font-bold text-[#6d8297]">
                <ColumnTitle order={order} name="">
                  Consolidator
                </ColumnTitle>
              </td>
              <td className="py-2 font-bold text-[#6d8297] rounded-r-lg">
                <ColumnTitle
                  isActive={sortBy === "created_at"}
                  order={order}
                  name="created_at"
                  onClick={() => {
                    if (sortBy === "created_at") {
                      if (order === "asc") setOrder("desc");
                      else setOrder("asc");
                    } else {
                      setSortBy("created_at");
                    }
                  }}
                >
                  Date
                </ColumnTitle>
              </td>
            </tr>
          </thead>
          <tbody>
            {consolidations?.map((item, index) => {
              const isLast = consolidations.length - 1 === index;
              return (
                <tr
                  key={item.id}
                  className={`hover:border-[transparent] hover:bg-[#f4f7fa] ${
                    isLast ? "" : "border-b"
                  }`}
                >
                  <td className="py-2 rounded-l-lg"></td>
                  <td className="py-2">{item.lesson_code.code}</td>
                  <td className="py-2">
                    {item.disciple_id.first_name ?? ""}{" "}
                    {item.disciple_id?.last_name ?? ""}
                  </td>
                  <td className="py-2">
                    {item.consolidator_id.first_name ?? ""}{" "}
                    {item.consolidator_id?.last_name ?? ""}
                  </td>
                  <td className="py-2 rounded-r-lg">
                    {moment(item.created_at).format("LLL")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
      {showAddModal && (
        <div className="fixed top-0 w-screen h-screen bg-[#3c4151b3] z-10">
          <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white rounded-2xl w-[560px] relative p-7">
              <div className="absolute top-0 right-0 p-4 text-2xl text-gray-600">
                <button onClick={() => setShowAddModal(false)}>
                  <RiCloseCircleFill />
                </button>
              </div>
              <header className="text-center font-bold text-2xl text-[#3c4151]">
                Add Consolidator
              </header>
              <div className="mt-4">
                <input
                  onKeyPress={onKeyPress}
                  onChange={onChange}
                  id="input-search-conso"
                  placeholder="Search"
                  className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                />
              </div>
              {consolidators && (
                <div className="max-h-[150px] overflow-y-auto flex flex-col py-2">
                  {disciplesSearch?.map((item) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => {
                          setSelectedDisciple(item);
                          setDisciplesSearch(null);
                          (
                            document.getElementById(
                              "input-search-conso"
                            ) as HTMLInputElement
                          ).value = `${item.first_name ?? ""} ${
                            item?.last_name ?? ""
                          }`;
                        }}
                        className="block py-2 hover:bg-[#f4f7fa] px-4 rounded-lg cursor-pointer"
                      >
                        {item.first_name} {item.last_name}
                      </li>
                    );
                  })}
                </div>
              )}
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    onClick={handleAddConsolidator}
                    disabled={!selectedDisciple || isAddingDisciple}
                    className="grow gap-2 flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
                  >
                    Add as Consolidator
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

function Lessons({ onSelect }: { onSelect: (value: string) => any }) {
  const ref = useRef(null);
  const [selected, setSelected] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useOnClickOutside(ref, (event: any) => {
    setIsOpen(false);
  });

  return (
    <div ref={ref} className="grow relative">
      <div className="relative">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="border-2 w-full rounded-lg relative py-[5px] px-4 cursor-pointer"
        >
          <label
            style={{ marginTop: -10 }}
            className="text-[9px] bg-white absolute top-0 left-2 px-2 text-gray-500 font-bold "
          >
            Lesson
          </label>
          <span className="text-xs font-bold">{selected || "All"}</span>
        </div>
        {isOpen && (
          <div
            style={{ marginTop: -7, zIndex: 1 }}
            className="border-2 absolute w-full bg-white rounded-b-lg border-t-0"
          >
            <div className="border-t-2 mt-1" />
            <div className="text-right px-3 mt-2">
              <button
                onClick={() => {
                  setSelected("");
                  setIsOpen(false);
                  onSelect("");
                }}
                className="text-xs border-2 px-3 py-1 rounded-lg font-bold border-[#6474dc] text-[#6474dc] hover:text-white hover:bg-[#4c55dc] hover:border-[#4c55dc] w-full"
              >
                Clear
              </button>
            </div>
            <div className="h-[140px] overflow-auto">
              <ul className="p-3 font-bold text-sm">
                {new Array(10).fill(null).map((item, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      setSelected("Lesson " + (index + 1));
                      setIsOpen(false);
                      onSelect(`L${index + 1}`);
                    }}
                    className="block px-4 py-2 rounded-lg hover:bg-[#f4f7fa] cursor-pointer"
                  >
                    Lesson {index + 1}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type PersonProps = {
  setSearchPerson: (value: { key: string; value: string } | null) => any;
};

function Person(props: PersonProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [result, setResult] = useState<Disciples[] | null>(null);
  const [selected, setSelected] = useState<Disciples | null>(null);
  const [searchAs, setSearchAs] = useState<"disciple" | "consolidator">(
    "disciple"
  );

  useOnClickOutside(ref, (event: any) => {
    setIsOpen(false);
  });

  const onChange = debounce((e: any) => {
    axios.get(`/api/disciples?q=${e.target.value}`).then((res) => {
      setResult(res.data);
      if (!isOpen) setIsOpen(true);
    });
  }, 1000);

  const handleOnApply = () => {
    props.setSearchPerson({
      key: searchAs,
      value: selected?.id ?? "",
    });
  };

  return (
    <div ref={ref} className="grow relative">
      <div className="relative">
        <div
          onClick={() => {
            setIsOpen(!isOpen);
            document.getElementById("person-input")?.focus();
          }}
          className="border-2 w-full rounded-lg relative py-[5px] px-4 cursor-pointer"
        >
          <label
            style={{ marginTop: -10 }}
            className="text-[9px] bg-white absolute top-0 left-2 px-2 text-gray-500 font-bold"
          >
            Search Person
          </label>
          <input
            id="person-input"
            onChange={onChange}
            placeholder="All"
            className="text-xs font-bold w-full outline-0"
          />
        </div>
        <div
          style={{
            marginTop: -7,
            zIndex: 1,
            display: isOpen ? "block" : "none",
          }}
          className="border-2 absolute w-full bg-white rounded-b-lg border-t-0"
        >
          <div className="border-t-2 mt-1" />
          <div className="text-right px-3 mt-2 flex gap-1 justify-end">
            <button
              onClick={() => {
                (document.getElementById("person-input") as any).value = "";
                setIsOpen(false);
                props.setSearchPerson(null);
              }}
              className="text-xs border-2 px-3 py-1 rounded-lg font-bold border-[#6474dc] text-[#6474dc] hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleOnApply}
              className="text-xs border-2 px-3 py-1 rounded-lg font-bold bg-[#6474dc] border-[#6474dc] text-white hover:bg-[#4c55dc] hover:border-[#4c55dc]"
            >
              Apply
            </button>
          </div>
          <div className="text-xs px-3 pb-3">
            <label>Search as:</label>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setSearchAs("disciple")}
                className={`grow py-1 border-2 rounded-lg px-3 ${
                  searchAs === "disciple"
                    ? "border-[#4c55dc] text-[#4c55dc] font-bold"
                    : ""
                }`}
              >
                Disciple
              </button>
              <button
                onClick={() => setSearchAs("consolidator")}
                className={`grow py-1 border-2 rounded-lg ${
                  searchAs === "consolidator"
                    ? "border-[#4c55dc] text-[#4c55dc] font-bold"
                    : ""
                }`}
              >
                Consolidator
              </button>
            </div>
          </div>
          <div className="max-h-[140px] overflow-auto">
            <ul className="px-3 pb-3 font-bold text-sm">
              {result?.map((item) => (
                <li
                  onClick={() => {
                    setSelected(item);
                    setResult(null);
                    (document.getElementById("person-input") as any).value = `${
                      item.first_name ?? ""
                    } ${item?.last_name ?? ""}`;
                  }}
                  key={item.id}
                  className="block px-4 py-2 rounded-lg hover:bg-[#f4f7fa] cursor-pointer"
                >
                  {item.first_name ?? ""} {item?.last_name ?? ""}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

type DateRangeProps = {
  startDate?: string;
  endDate?: string;
  onChange?: (start: Moment, end: Moment) => any;
};

function DateRange({ onChange }: DateRangeProps) {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [calendarInitialized, setCalendarInitialized] = useState(false);

  useOnClickOutside(ref, (event: any) => {
    setIsOpen(false);
  });

  const handleClick = () => {
    if (!calendarInitialized) {
      ($?.("#daterange-input") as any)?.daterangepicker?.(
        {
          locale: {
            format: "MM-DD-YYYY",
          },
          applyButtonClasses: "bg-[#6474dc] text-white rounded-lg",
        },
        (start: Moment, end: Moment, label?: string) => {
          onChange?.(start, end);
        }
      );

      setCalendarInitialized(true);
    }

    setIsOpen(!isOpen);
    document.getElementById("daterange-input")?.focus?.();
  };

  return (
    <div ref={ref} className="grow relative">
      <div className="relative">
        <div
          onClick={handleClick}
          className="border-2 w-full rounded-lg relative py-[5px] pl-4 cursor-pointer"
        >
          <label
            style={{ marginTop: -10 }}
            className="text-[9px] bg-white absolute top-0 left-2 px-2 text-gray-500 font-bold "
          >
            From To Date
          </label>
          <input
            id="daterange-input"
            placeholder="All"
            className="text-xs font-bold w-full outline-0"
          />
        </div>
      </div>
    </div>
  );
}

function useOnClickOutside(ref: any, handler: (event: any) => any) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export const getServerSideProps = getServerSidePropsWithAuth();
