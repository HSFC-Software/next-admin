import Layout from "@/components/layout";
import Head from "next/head";
import { AiOutlineStock, AiOutlineUsergroupAdd } from "react-icons/ai";

export default function NetworkConsolidator() {
  return (
    <>
      <Head>
        <title>Consolidation</title>
        <meta name="description" content="Consolidation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <div className="flex flex-col gap-4">
          <div>
            <button className="gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-xs font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md">
              <span className="text-md">
                <AiOutlineUsergroupAdd />
              </span>
              <span>Give Badge</span>
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
