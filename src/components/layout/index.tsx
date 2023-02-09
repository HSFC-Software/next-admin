import Image from "next/image";
import { AiOutlineFire, AiOutlineUsergroupAdd } from "react-icons/ai";
import { RiHome5Line } from "react-icons/ri";
import { BiNetworkChart } from "react-icons/bi";
import { ReactNode } from "react";
import Link from "next/link";

export default function Layout(props: {
  children: ReactNode;
  activeRoute?: string;
}) {
  const { children, activeRoute } = props;
  return (
    <>
      <div className="w-screen h-screen bg-white flex p-2 overflow-hidden">
        <aside className="flex flex-col w-[240px] bg-[#f4f7fa] p-4 rounded-3xl">
          <div className="grow">
            <div className="flex items-center gap-2">
              <Image
                width={42}
                height={42}
                alt="hsfc-icon"
                src="https://taytay.fishgen.org/nextimg/https%3A%2F%2Fimages.ctfassets.net%2F9ayzdmt1uxji%2FKDtunuSaHu2LuZ8hd4Csr%2Fb9cd87b078724a4c53255b51638189a3%2Fbrand-dark.png%3Ffm%3Dpng/256/75?url=https%3A%2F%2Fimages.ctfassets.net%2F9ayzdmt1uxji%2FKDtunuSaHu2LuZ8hd4Csr%2Fb9cd87b078724a4c53255b51638189a3%2Fbrand-dark.png%3Ffm%3Dpng&w=256&q=75"
              />
              <span className="font-semibold text-sm text-[#3c4151]">
                Taytay
              </span>
            </div>
            <div className="px-5 py-4 bg-white rounded-xl font-bold mt-5 text-[#3c4151] shadow-1">
              Sam
            </div>
            <div className="mt-8 font-medium flex flex-col gap-2">
              <Link href="/taytay">
                <li
                  className={`flex items-center cursor-pointer py-3 px-4 rounded-lg text-sm text-[#3c4151] ${
                    activeRoute === "home" ? "font-extrabold bg-[#e0e9f1]" : ""
                  }`}
                >
                  <span className="w-[35px] text-xl opacity-[.8]">
                    <RiHome5Line />
                  </span>
                  <div>Home</div>
                </li>
              </Link>
              <Link href="/taytay/conso">
                <li
                  className={`flex items-center cursor-pointer hover:bg-[#e0e9f1] py-3 px-4 rounded-lg text-sm text-[#3c4151] ${
                    activeRoute === "conso" ? "font-extrabold bg-[#e0e9f1]" : ""
                  }`}
                >
                  <span className="w-[35px] text-xl opacity-[.8]">
                    <AiOutlineFire />
                  </span>
                  <div>Consolidation</div>
                </li>
              </Link>
              <Link href="/taytay/network">
                <li
                  className={`flex items-center cursor-pointer hover:bg-[#e0e9f1] py-3 px-4 rounded-lg text-sm text-[#3c4151] ${
                    activeRoute === "network"
                      ? "font-extrabold bg-[#e0e9f1]"
                      : ""
                  }`}
                >
                  <span className="w-[35px] text-xl opacity-[.8]">
                    <BiNetworkChart />
                  </span>
                  <div>Network</div>
                </li>
              </Link>
            </div>
            <div className="w-full border-t my-4" />
            <div className="text-sm">
              <li className="py-3 px-4 block cursor-pointer hover:underline text-slate-500 hover:text-blue-500">
                What&apos;s new
              </li>
              <li className="py-3 px-4 block cursor-pointer hover:underline text-slate-500 hover:text-blue-500">
                Go to your website
              </li>
            </div>
          </div>
          <div>
            <button className="w-full gap-2 flex justify-center bg-[#6474dc] hover:bg-[#4c55dc] text-sm font-extrabold text-white py-3 px-4 rounded-lg hover:shadow-md mt-5">
              <span className="text-lg">
                <AiOutlineUsergroupAdd />
              </span>
              <span>Invite teammates</span>
            </button>
          </div>
        </aside>
        <main className="grow flex flex-col">
          <div className="flex items-center bg-white sticky top-0 p-5 px-10">
            <div className="grow">
              <span className="font-bold text-capitalize">Home</span>
            </div>
            <div className="shrink-0">
              <div className="bg-[#3c4151] w-[40px] h-[40px] font-bold flex justify-center items-center text-white rounded-full">
                S
              </div>
            </div>
          </div>
          <div className="grow overflow-y-auto max-w-5xl mx-auto w-full p-4">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
