import Layout from "@/components/layout";
import Head from "next/head";
import Link from "next/link";
import { Router } from "next/router";
import { AiOutlineStock, AiOutlineUsergroupAdd } from "react-icons/ai";
import { MdOutlineAssignmentInd } from "react-icons/md";

export default function Consolidation() {
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
          <div>
            <Link href="/taytay/conso/list">
              <button className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md">
                <span className="text-md">
                  <AiOutlineUsergroupAdd />
                </span>
                <span>Consolidations</span>
              </button>
            </Link>
          </div>
          <div>
            <Link href="/taytay/conso/assign">
              <button className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md">
                <span className="text-md">
                  <MdOutlineAssignmentInd />
                </span>
                <span>Assign VIP Consolidators</span>
              </button>
            </Link>
          </div>
          <div>
            <Link href="/taytay/conso/network">
              <button className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md">
                <span className="text-md">
                  <AiOutlineUsergroupAdd />
                </span>
                <span>Consolidators</span>
              </button>
            </Link>
          </div>
          <div>
            <button className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md">
              <span className="text-md">
                <AiOutlineStock />
              </span>
              <span>Reports</span>
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
