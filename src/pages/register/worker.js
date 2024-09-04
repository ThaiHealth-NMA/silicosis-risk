import React from "react";
import Head from "next/head";
import RegisterWorkerForm from "@/components/register/worker/RegisterWorkerForm";
import { MdNavigateBefore } from "react-icons/md";
import Link from "next/link";

export default function RegisterWorkerPage() {
  return (
    <div className="min-h-screen w-full bg-bases">
      <Head>
        <title>ลงทะเบียนผู้ประกอบอาชีพแกะสลักหิน</title>
        <meta name="description" content="Register Worker" />
      </Head>

      <nav className="w-full h-12 bg-success-light">
        <div className="max-w-[760px] mx-auto  pt-2 pl-2 ">
          <Link href="/" className="flex items-center w-fit">
            <MdNavigateBefore className="text-4xl text-neutral" />
            <span>กลับสู่หน้าหลัก</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-[760px] mx-auto h-full p-5">
        <RegisterWorkerForm />
      </main>
    </div>
  );
}
