import React, { useEffect, useState } from "react";
import Head from "next/head";
import AdminSidebar from "@/components/admin/AdminSidebar";
import BmiChart from "@/components/charts/BmiChart";
import HearingLossChart from "@/components/charts/HearingLossChart";
import WorkLocation from "@/components/map/WorkLocation";
import WorkingHearingLossChart from "@/components/charts/WorkingHearingLossChart";
import { getToken } from "../../../../lib/tokenManager";
import { useRouter } from "next/router";
import Loading from "@/components/loading/Loading";

export default function AdminDashboardPage() {
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
        <title>รายชื่อผู้ประกอบอาชีพทำครกหิน อ.เมือง จ.ลำปาง</title>
        <meta
          name="description"
          content="Health Risk Assessment Admin dashboard"
        />
      </Head>

      <div className="flex flex-row">
        {/* sidebar */}
        <AdminSidebar />

        {/* chart */}
        <div className="w-full md:ml-[276px] grid md:grid-cols-2 grid-cols-1 gap-8 p-8">
          <HearingLossChart />
          <WorkingHearingLossChart />
          <WorkLocation />
          <BmiChart />
        </div>
      </div>
    </div>
  );
}
