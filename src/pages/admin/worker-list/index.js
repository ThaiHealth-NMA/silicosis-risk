import React, { useEffect, useState } from "react";
import Head from "next/head";
import AdminSidebar from "@/components/admin/AdminSidebar";
import WorkerList from "@/components/admin/WorkerList";
import { getToken } from "../../../../lib/tokenManager";
import { useRouter } from "next/router";
import Loading from "@/components/loading/Loading";

export default function AdminWorkerListPage() {
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
        <title>รายชื่อผู้ประกอบอาชีพแกะสลักหินหิน อ.สีคิ้ว จ.นครราชสีมา</title>
        <meta
          name="description"
          content="Health Risk Assessment Admin dashboard"
        />
      </Head>

      <div className="flex md:ml-[276px] flex-row">
        {/* sidebar */}
        <AdminSidebar />

        {/* table worker-list */}
        <WorkerList />
      </div>
    </div>
  );
}
