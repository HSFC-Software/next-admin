import Layout from "@/components/layout";
import axios from "@/lib/axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import {
  RiCloseCircleFill,
  RiCheckFill,
  RiCloseFill,
  RiUserAddLine,
} from "react-icons/ri";
import { BiNetworkChart } from "react-icons/bi";
import { AiOutlineEdit } from "react-icons/ai";
import debounce from "lodash.debounce";
import moment, { Moment } from "moment";
import { IoCaretUpOutline, IoCaretDownOutline } from "react-icons/io5";
import { Disciple } from "@/types/Disciples";
import { Network } from "@/types/Network";
import Link from "next/link";
import { useRouter } from "next/router";

export type Consolidators = {
  id: string;
  created_at: string;
  disciples_id: Disciple;
  is_deleted: boolean;
  consolidators_lesson: string[];
};

type Order = "asc" | "desc";

export default function NetworkDetails() {
  const params = useRouter();

  const [network, setNetwork] = useState<Network | null>(null);
  const [networks, setNetworks] = useState<Network[] | null>(null);
  const [editAlias, setEditAlias] = useState(false);
  const [alias, setAlias] = useState("");
  const [isSavingAlias, setIsSavingAlias] = useState(false);
  const [showRelativeTime, setShowRelativeTime] = useState(true);

  // filters
  const [order, setOrder] = useState<Order>("desc");
  const [sortBy, setSortBy] = useState("created_at");
  const [searchLeader, setSearchLeader] = useState<{
    key: string;
    value: string;
  } | null>(null);
  const [dateRange, setDateRange] = useState<{
    dateStart: Moment;
    dateEnd: Moment;
  } | null>();
  const [fuzzySearchKeyword, setFuzzySearchKeyword] = useState("");

  useEffect(() => {
    const queryObject: { [key: string]: string } = {
      sortBy,
      order,
    };

    if (searchLeader) {
      queryObject.discipler_id = searchLeader?.value;
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

    axios.get(`/api/networks?${q}`).then((res) => {
      setNetworks(res.data);
    });
  }, [searchLeader, dateRange, sortBy, order]);

  const [consolidators, setConsolidators] = useState<Consolidators[] | null>(
    null
  );
  const [disciplesSearch, setDisciplesSearch] = useState<Disciple[] | null>(
    null
  );
  const [selectedDisciple, setSelectedDisciple] = useState<Disciple | null>(
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

  const handleClearFilter = () => {
    setSearchLeader(null);
    setDateRange(null);
    setFuzzySearchKeyword("");
    (document.getElementById("person-input") as any).value = "";
    (document.getElementById("daterange-input") as any).value = "";
    (document.getElementById("search-input") as any).value = "";
  };

  const handleAddNetwork = (name?: string) => {
    setIsAddingDisciple(true);
    axios
      .post("/api/networks", {
        discipler_id: selectedDisciple?.id,
        name: name ?? `${selectedDisciple?.first_name}'s Network`,
      })
      .finally(() => {
        setIsAddingDisciple(false);
        axios.get("/api/networks").then((res) => {
          setConsolidators(res.data);
        });
        handleClearFilter();
        setShowAddModal(false);
      });
  };

  useEffect(() => {
    const id = params.query.id;
    if (id) {
      axios
        .get<Network>(`/api/networks/${id}`)
        .then((res) => {
          setNetwork(res.data);
          setAlias(res.data.name);
        })
        .catch((err) => {
          // todo: Handle not found data
        });
    }
  }, [params]);

  const handleUpdateAlias = () => {
    if (!alias) return;
    setIsSavingAlias(true);
    axios
      .patch<Network>(`api/networks/${params.query.id}`, {
        name: alias,
      })
      .then((res) => {
        setNetwork(res.data);
        setEditAlias(false);
      })
      .catch((err) => {
        // todo: Handle not found data
      })
      .finally(() => {
        setIsSavingAlias(false);
      });
  };

  return (
    <>
      <Head>
        <title>Networks</title>
        <meta name="description" content="Networks" />
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
      <Layout activeRoute="network">
        <div className="flex flex-col gap-4 mb-7">
          <div className="flex items-center gap-3">
            {!editAlias && (
              <>
                <button
                  onClick={() => {
                    setEditAlias(true);
                    setAlias(network?.name ?? "");
                  }}
                  className="text-xl text-gray-500 mt-2"
                >
                  <AiOutlineEdit />
                </button>
                <h1 className="text-4xl font-bold">{network?.name}</h1>
              </>
            )}
            {editAlias && (
              <>
                <span className="flex flex-col">
                  <button
                    disabled={isSavingAlias}
                    onClick={handleUpdateAlias}
                    className="text-xl text-gray-500 text-green-500 hover:bg-gray-100 rounded"
                  >
                    <RiCheckFill />
                  </button>
                  <button
                    disabled={isSavingAlias}
                    onClick={() => setEditAlias(false)}
                    className="text-xl text-gray-500 text-red-400 hover:bg-gray-100 rounded"
                  >
                    <RiCloseFill />
                  </button>
                </span>
                <input
                  disabled={isSavingAlias}
                  autoFocus
                  value={alias}
                  onChange={(e) => setAlias(e?.target?.value)}
                  className="text-4xl font-bold outline-0 w-full"
                  placeholder="Enter Network Alias"
                />
              </>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Leader: {network?.discipler_id?.first_name ?? ""}{" "}
            {network?.discipler_id?.last_name ?? ""} - Opened last{" "}
            {showRelativeTime && (
              <span
                className="cursor-pointer underline"
                onClick={() => setShowRelativeTime(false)}
              >
                {moment(network?.created_at).fromNow()}
              </span>
            )}
            {!showRelativeTime && (
              <span
                className="cursor-pointer underline"
                onClick={() => setShowRelativeTime(true)}
              >
                {moment(network?.created_at).format("LL")}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2 items-center justify-between">
          <header className="text-xl font-bold">Members</header>
          <button className="flex gap-2 items-center bg-[#6474dc] hover:bg-[#4c55dc] text-sm px-4 rounded text-white py-2 font-bold">
            <RiUserAddLine />
            Add member
          </button>
        </div>
        <div className="max-h-[280px] overflow-y-auto mt-4">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-[#f4f7fa] sticky top-0">
                <td className="py-2 pl-2 rounded-l-lg">
                  {/* <div className="border-2 rounded-md w-[21px] h-[21px] bg-white cursor-pointer" /> */}
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle
                    isActive={sortBy === "name"}
                    order={order}
                    name="name"
                    onClick={() => {
                      if (sortBy === "name") {
                        if (order === "asc") setOrder("desc");
                        else setOrder("asc");
                      } else {
                        setSortBy("name");
                      }
                    }}
                  >
                    (Alias)
                  </ColumnTitle>
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle order={order} name="">
                    Leader
                  </ColumnTitle>
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle order={order} name="">
                    Member Count
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
                    Date Opened
                  </ColumnTitle>
                </td>
              </tr>
            </thead>
            <tbody>
              {networks
                ?.filter((item) =>
                  JSON.stringify(item)
                    ?.toLowerCase()
                    ?.includes(fuzzySearchKeyword.toLowerCase?.())
                )
                ?.map((item, index) => {
                  const isLast = networks.length - 1 === index;
                  return (
                    <tr
                      onClick={() => {
                        document.getElementById(item.id)?.click();
                      }}
                      key={item.id}
                      className={`hover:border-[transparent] hover:bg-[#f4f7fa] cursor-pointer ${
                        isLast ? "" : "border-b"
                      }`}
                    >
                      <td className="py-2 rounded-l-lg">
                        <Link
                          id={item.id}
                          href={`/taytay/network/${item.id}`}
                        />
                      </td>
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">
                        {item?.discipler_id?.first_name ?? ""}{" "}
                        {item?.discipler_id?.last_name ?? ""}
                      </td>
                      <td className="py-2">{item.member_count}</td>
                      <td className="py-2 rounded-r-lg">
                        {moment(item.created_at).format("LL")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="flex gap-2 items-center justify-between mt-10">
          <header className="text-xl font-bold">Networks</header>
          <button className="flex gap-2 items-center bg-[#6474dc] hover:bg-[#4c55dc] text-sm px-4 rounded text-white py-2 font-bold">
            <BiNetworkChart />
            Add Network
          </button>
        </div>
        <div className="max-h-[280px] overflow-y-auto mt-4">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-[#f4f7fa] sticky top-0">
                <td className="py-2 pl-2 rounded-l-lg">
                  {/* <div className="border-2 rounded-md w-[21px] h-[21px] bg-white cursor-pointer" /> */}
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle
                    isActive={sortBy === "name"}
                    order={order}
                    name="name"
                    onClick={() => {
                      if (sortBy === "name") {
                        if (order === "asc") setOrder("desc");
                        else setOrder("asc");
                      } else {
                        setSortBy("name");
                      }
                    }}
                  >
                    (Alias)
                  </ColumnTitle>
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle order={order} name="">
                    Leader
                  </ColumnTitle>
                </td>
                <td className="py-2 font-bold text-[#6d8297]">
                  <ColumnTitle order={order} name="">
                    Member Count
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
                    Date Opened
                  </ColumnTitle>
                </td>
              </tr>
            </thead>
            <tbody>
              {networks
                ?.filter((item) =>
                  JSON.stringify(item)
                    ?.toLowerCase()
                    ?.includes(fuzzySearchKeyword.toLowerCase?.())
                )
                ?.map((item, index) => {
                  const isLast = networks.length - 1 === index;
                  return (
                    <tr
                      onClick={() => {
                        document.getElementById(item.id)?.click();
                      }}
                      key={item.id}
                      className={`hover:border-[transparent] hover:bg-[#f4f7fa] cursor-pointer ${
                        isLast ? "" : "border-b"
                      }`}
                    >
                      <td className="py-2 rounded-l-lg">
                        <Link
                          id={item.id}
                          href={`/taytay/network/${item.id}`}
                        />
                      </td>
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">
                        {item?.discipler_id?.first_name ?? ""}{" "}
                        {item?.discipler_id?.last_name ?? ""}
                      </td>
                      <td className="py-2">{item.member_count}</td>
                      <td className="py-2 rounded-r-lg">
                        {moment(item.created_at).format("LL")}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
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
                New Network
              </header>
              <div className="mt-4">
                <input
                  onKeyPress={onKeyPress}
                  onChange={onChange}
                  id="input-search-conso"
                  placeholder="Search Leader"
                  className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                />
              </div>
              {!!disciplesSearch?.length && (
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
              <textarea
                id="network-alias"
                rows={3}
                placeholder="Network Alias"
                className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
              ></textarea>
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleAddNetwork(
                        (document.getElementById("network-alias") as any)
                          ?.value ?? null
                      );
                    }}
                    disabled={!selectedDisciple || isAddingDisciple}
                    className="grow gap-2 flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
                  >
                    Add Network
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
