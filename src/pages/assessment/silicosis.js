import React from "react";
import Head from "next/head";
import { MdNavigateBefore } from "react-icons/md";
import Link from "next/link";
import AssessSilicosisForm from "@/components/assessments/hearingloss/AssessSilicosisForm";

export default function AssessmentSilicosisPage() {
  return (
    <div className="min-h-screen w-full bg-bases">
      <Head>
        <title>ประเมินความเสี่ยงการรับสัมผัสฝุ่นซิลิกา</title>
        <meta name="description" content="Silicosis Risk Assessment" />
      </Head>

      <nav className="w-full h-12 bg-accent-light">
        <div className="max-w-[1024px] mx-auto  pt-2 pl-2 ">
          <Link href="/" className="flex items-center w-fit">
            <MdNavigateBefore className="text-4xl text-neutral" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-[1024px] mx-auto h-full p-5">
        <AssessSilicosisForm />
      </main>
    </div>
  );
}
