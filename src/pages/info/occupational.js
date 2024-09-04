import InfoOccupational from "@/components/infoOccupational/InfoOccupational";
import React from "react";
import Head from "next/head";
import Link from "next/link";
import { MdNavigateBefore } from "react-icons/md";

export default function InfOccupationalPage() {
  return (
    <div className="min-h-screen w-full bg-bases">
      <Head>
        <title>ข้อมูลข่าวสาร อาชีวอนามัยและความปลอดภัย</title>
        <meta name="description" content="Info Occupational" />
      </Head>

      <nav className="w-full h-12 bg-success-light">
        <div className="max-w-[1024px] mx-auto  pt-2 pl-2 ">
          <Link href="/" className="flex items-center w-fit">
            <MdNavigateBefore className="text-4xl text-neutral" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-[1024px] mx-auto h-full p-5">
        <InfoOccupational />
      </main>
    </div>
  );
}
