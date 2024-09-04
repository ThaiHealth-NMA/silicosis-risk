import AdminSidebar from "@/components/admin/AdminSidebar";
import Loading from "@/components/loading/Loading";
import UpdateWorkerForm from "@/components/worker/UpdateWorkerForm";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getToken } from "../../../../lib/tokenManager";

export default function UpdateWorkerPage() {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthorized(true);
    } else {
      router.push("/admin/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen w-full">
      <Head>
        <title>แก้ไขผู้ประกอบอาชีพทำครกหิน อ.เมือง จ.ลำปาง</title>
        <meta
          name="description"
          content="Health Risk Assessment Admin dashboard"
        />
      </Head>

      <div className="flex md:ml-[276px] flex-row">
        {/* sidebar */}
        <AdminSidebar />

        {/* update worker form */}
        <UpdateWorkerForm />
      </div>
    </div>
  );
}
