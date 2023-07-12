import Layout from "@/components/layout";
import axios from "@/lib/axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { getRootProps } from "@/lib/state";
import { useRouter } from "next/router";

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

export default function NetworkConsolidator() {
  const router = useRouter();

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

  const [searchQ, setSearchQ] = useState("");

  const onKeyPress = () => {
    setDisciplesSearch(null);
  };

  const onChange = (e: any) => {
    setSearchQ(e.target.value);
    axios.get(`/api/disciples?q=${e.target.value}`).then((res) => {
      setDisciplesSearch(res.data);
    });
  };

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

  useEffect(() => {
    axios.get("/api/consolidators").then((res) => {
      setConsolidators(res.data);
    });
  }, []);

  useEffect(() => {
    if (router?.query?.assignToNew) {
      if (!showAddModal) setShowAddModal(true);
      const vip: any = getRootProps("consolidation.vip");
      setSearchQ(vip?.consolidatorQ);

      // Todo: remove this when useQuery of getting of disciples is done
      onChange({ target: { value: vip?.consolidatorQ } });
    }
  }, []);

  const handleCloseModal = () => {
    if (router?.query?.assignToNew) {
      router.push("/conso/assign?assignToNew=true");
    } else {
      setShowAddModal(false);
    }
  };

  // todo: prevent double entry

  return (
    <>
      <Head>
        <title>Consolidation</title>
        <meta name="description" content="Consolidation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout activeRoute="conso">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">Consolidators List</h1>
        </div>
        <div className="mt-4  w-full rounded-xl py-4 flex gap-3 ">
          <button
            onClick={() => setShowAddModal(true)}
            className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
          >
            <span>Add Consolidator</span>
          </button>
        </div>
        <table className="table-auto w-full mt-7 text-sm">
          <thead>
            <tr className="bg-[#f4f7fa]">
              <td className="py-2 pl-2 rounded-l-lg">
                <div className="border-2 rounded-md w-[21px] h-[21px] bg-white cursor-pointer" />
              </td>
              <td className="py-2 font-bold text-[#6d8297]">Name</td>
              <td className="py-2 font-bold text-[#6d8297] rounded-r-lg">
                Lessons
              </td>
            </tr>
          </thead>
          <tbody>
            {consolidators?.map((item, index) => {
              const isLast = consolidators.length - 1 === index;
              return (
                <tr
                  key={item.id}
                  className={`hover:border-[transparent] hover:bg-[#f4f7fa] ${
                    isLast ? "" : "border-b"
                  }`}
                >
                  <td className="py-2 rounded-l-lg"></td>
                  <td className="py-2">
                    {item.disciples_id.first_name} {item.disciples_id.last_name}
                  </td>
                  <td className="py-2 rounded-r-lg">
                    <div className="flex gap-2">
                      {item.consolidators_lesson.map((code) => {
                        return (
                          <span
                            className="text-xs px-2 rounded-full font-bold bg-gray-200"
                            key={code}
                          >
                            {code}
                          </span>
                        );
                      })}
                    </div>
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
                <button onClick={handleCloseModal}>
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
                  value={searchQ}
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
