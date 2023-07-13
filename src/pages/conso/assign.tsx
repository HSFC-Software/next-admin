import Layout from "@/components/layout";
import axios from "@/lib/axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import moment from "moment";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Consolidators } from "./network";
import { useNewVip } from "@/lib/mutation";
import { RiAddCircleFill } from "react-icons/ri";
import { useGetConsolidators, useGetVips } from "@/lib/queries";
import useRootActions from "@/lib/state/useRootActions";
import { useRouter } from "next/router";
import { getRootProps } from "@/lib/state";

type VIP = {
  id: string;
  created_at: string;
  status: "ASSIGNED" | "PENDING";
  disciples: {
    id: string;
    created_at: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    gender?: string;
    address?: string;
    contact_number?: string;
    birthday?: string;
    is_deleted?: string;
    email?: string;
  };
};

export default function NetworkConsolidator() {
  const router = useRouter();
  const actions = useRootActions();

  const [_, setVips] = useState<VIP[] | null>(null);
  const [selectedVip, setSelectedVip] = useState<VIP | null>(null);
  const [selectedConsolidator, setSelectedConsolidator] =
    useState<Consolidators | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showCreateVipModal, setShowCreateVipModal] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const { data: _vips, refetch: getVip } = useGetVips("PENDING");
  const { data: consolidators } = useGetConsolidators();

  const vips = _vips || [];

  const _consolidators = (consolidators ?? [])?.filter((item: any) => {
    const keywords = searchQ.trim().split(" ");

    for (let word of keywords) {
      if (
        item.disciples.first_name.toLowerCase().includes(word.toLowerCase()) ||
        item.disciples.last_name.toLowerCase().includes(word.toLowerCase())
      ) {
        return true;
      }
    }

    return false;
  });

  const onChange = (e: any) => {
    setSelectedConsolidator(null);
    setSearchQ(e.target.value);
  };

  const handleAssign = () => {
    setIsAssigning(true);
    axios
      .post("/api/consolidations", {
        lesson_code: "L1",
        consolidator_id: selectedConsolidator?.disciples.id,
        disciple_id: selectedVip?.disciples.id,
      })
      .then(() => {
        setSelectedConsolidator(null);
        setSelectedVip(null);
        setIsAssigning(false);
        axios.get("/api/vips").then((res) => {
          setVips(res.data);
        });
      });
  };

  const handleAddConsolidator = () => {
    actions?.handleAddNewConsolidatorFromVip(String(selectedVip?.id), searchQ);
    router.push(`/conso/network?assignToNew=true`);
  };

  useEffect(() => {
    if (vips) {
      if (router?.query?.assignToNew) {
        const vip = getRootProps<any>("consolidation.vip");
        const selected = vip.selectedId ?? "";
        setSearchQ(vip?.consolidatorQ);

        const assignBtn = document.getElementById(`btn-${selected}`);

        if (assignBtn) assignBtn?.click?.();
      }
    }
  }, [vips]);

  const handleCloseAssign = () => {
    if (router?.query?.assignToNew) {
      actions?.handleAddNewConsolidatorFromVip("", "");
      router.push(`/conso/assign`);
      setSearchQ("");
    }

    setSelectedVip(null);
  };

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
          <h1 className="text-4xl font-bold flex items-center gap-3">
            VIPs
            <button onClick={() => setShowCreateVipModal(true)}>
              <RiAddCircleFill size={24} color="#6474dc" />
            </button>
          </h1>
        </div>
        <table className="table-auto w-full mt-7 text-sm">
          <thead>
            <tr className="bg-[#f4f7fa]">
              <td className="py-2 pl-2 font-bold text-[#6d8297] rounded-l-xl">
                Name
              </td>
              <td className="py-2 font-bold text-[#6d8297]">Date Attended</td>
              <td className="py-2 pl-2 rounded-r-xl"></td>
            </tr>
          </thead>
          <tbody>
            {vips?.map((item: any, index: number) => {
              const isLast = vips.length - 1 === index;
              return (
                <tr
                  className={`hover:border-[transparent] hover:bg-[#f4f7fa] ${
                    isLast ? "border-0" : "border-b"
                  }`}
                  key={item.id}
                >
                  <td className="py-1 pl-2 rounded-l-xl">
                    {item.disciples.first_name} {item.disciples.last_name}
                  </td>
                  <td className="py-1">
                    {moment(item.created_at).format("LLL")}
                  </td>
                  <td className="py-1 pl-2 rounded-r-xl ">
                    <button
                      id={`btn-${item.id}`}
                      onClick={() => setSelectedVip(item)}
                      className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-2 px-3 rounded-lg hover:shadow-md"
                    >
                      <span className="text-md">
                        <AiOutlineUsergroupAdd />
                      </span>
                      <span>Assign Consolidator</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Layout>
      {selectedVip && (
        <div className="fixed top-0 w-screen h-screen bg-[#3c4151b3] z-10">
          <div className="flex w-full h-full justify-center items-center">
            <div className="bg-white rounded-2xl w-[560px] relative p-7">
              <header className="text-center font-bold text-2xl text-[#3c4151]">
                Assign Consolidator to{" "}
                <span className="capitalize">
                  {selectedVip.disciples.first_name}
                </span>
              </header>
              <div className="mt-4">
                <input
                  id="input-search-conso"
                  onChange={onChange}
                  value={searchQ}
                  placeholder="Search"
                  className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
                />
              </div>

              {Boolean(searchQ) &&
                !!_consolidators?.length &&
                !selectedConsolidator && (
                  <div className="max-h-[150px] overflow-y-auto flex flex-col py-2">
                    {_consolidators?.map((item) => {
                      return (
                        <li
                          key={item.id}
                          onClick={() => {
                            setSelectedConsolidator(item);
                            setSearchQ(
                              `${item.disciples.first_name ?? ""} ${
                                item.disciples?.last_name ?? ""
                              }`
                            );
                          }}
                          className="block py-2 hover:bg-[#f4f7fa] px-4 rounded-lg cursor-pointer"
                        >
                          {item.disciples.first_name}{" "}
                          {item?.disciples?.last_name}
                        </li>
                      );
                    })}
                  </div>
                )}
              {Boolean(searchQ) && _consolidators?.length <= 3 && (
                <div className="my-4">
                  <div className="text-sm text-center">
                    <div className="text-gray-500">Consolidator not found?</div>
                    <button
                      onClick={handleAddConsolidator}
                      className="underline text-[#6474dc]"
                    >
                      Add new consolidator instead.
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-5">
                <div className="flex gap-2">
                  <button
                    disabled={isAssigning}
                    onClick={handleCloseAssign}
                    className={`grow gap-2 flex justify-center ${
                      !!selectedConsolidator
                        ? "bg-[#e0e9f1] hover:bg-[#e0e9f1]"
                        : "bg-[#6474dc] hover:bg-[#6474dc]"
                    } disabled:bg-[#e0e9f1] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md`}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!selectedConsolidator || isAssigning}
                    onClick={handleAssign}
                    className="grow gap-2 flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
                  >
                    Assign
                  </button>
                </div>
                <div className="text-right mt-2 text-gray-400 text-sm hover:underline hover:text-[#6474dc] cursor-pointer">
                  Need help?
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <CreateVip
        isVisible={showCreateVipModal}
        onSuccess={getVip}
        onCancel={() => setShowCreateVipModal(false)}
      />
    </>
  );
}

function CreateVip(props: {
  isVisible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [contact_number, setContact_number] = useState("");

  const { mutate: handleNewVip, isLoading } = useNewVip();

  const handleSubmit = () => {
    handleNewVip(
      { first_name, last_name, contact_number },
      {
        onSettled: () => {
          props.onSuccess();
          props.onCancel();
        },
      }
    );
  };

  if (!props.isVisible) return null;

  return (
    <div className="fixed top-0 w-screen h-screen bg-[#3c4151b3] z-10">
      <div className="flex w-full h-full justify-center items-center">
        <div className="bg-white rounded-2xl w-[560px] relative p-7">
          <header className="text-center font-bold text-2xl text-[#3c4151]">
            New VIP
          </header>
          <div className="mt-4">
            <input
              autoFocus
              value={first_name}
              onChange={(e) => setFirst_name(e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
            />
            <input
              value={last_name}
              onChange={(e) => setLast_name(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
            />
            <input
              value={contact_number}
              onChange={(e) => setContact_number(e.target.value)}
              placeholder="Contact Number"
              className="w-full px-4 py-2 border-2 rounded-2xl mt-2"
            />
          </div>

          <button
            onClick={props.onCancel}
            className="text-[#6474dc] mt-4 w-full flex justify-center text-xs font-extrabold text-white py-3 px-4 rounded-lg"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            onClick={handleSubmit}
            className="mt-4 w-full flex justify-center disabled:bg-[#e0e9f1] bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
