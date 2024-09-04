import React from "react";
import Head from "next/head";
import AdminLogin from "@/components/admin/AdminLogin";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>เข้าสู่ระบบจัดการผู้ประกอบอาชีพทำครกหิน อ.เมือง จ.ลำปาง</title>
        <meta name="description" content="Health Risk Assessment Admin Login" />
      </Head>

      <div className="">
        <AdminLogin />
      </div>
    </div>
  );
}
