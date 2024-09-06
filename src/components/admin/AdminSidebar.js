import { useState } from "react";
import { useRouter } from "next/router";
import { BiLogOut, BiMenu } from "react-icons/bi";
import { BsGraphUp, BsList } from "react-icons/bs";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  return (
    <div>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-3 absolute">
        <button onClick={toggleSidebar} className="text-bases-content">
          <BiMenu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 w-[276px] md:h-screen h-full p-6 max-md:bg-success-light text-bases-content flex flex-col justify-between transition-transform duration-300 z-50 ${
          isSidebarOpen
            ? "transform translate-x-0"
            : "transform -translate-x-full"
        } md:fixed md:transform-none md:translate-x-0`}
      >
        <div className="w-full flex flex-col gap-5">
          <div>
            <p className="text-xl font-bold text-center">
              ระบบจัดการข้อมูล
              <br />
              กลุ่มอาชีพทำครกหิน
              <br />
              อ.เมือง จ.ลำปาง
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <button
              className="flex flex-row justify-start items-center gap-2 px-2 py-3 focus:bg-success hover:bg-success-light rounded-xl"
              onClick={() => {
                router.push("/admin/dashboard");
              }}
            >
              <BsGraphUp className="w-10" />
              <p className="text-start">สรุปภาพรวมข้อมูล</p>
            </button>

            <button
              className="flex flex-row justify-start items-center gap-2 px-2 py-3 focus:bg-success hover:bg-success-light rounded-xl"
              onClick={() => {
                router.push("/admin/worker-list");
              }}
            >
              <BsList className="w-10" />
              <p className="text-start">รายชื่อ</p>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <button
            className="flex flex-row justify-start items-center gap-2 px-2 py-3 focus:bg-success hover:bg-success-light rounded-xl"
            onClick={handleLogout}
          >
            <BiLogOut />
            <p className="text-start">ออกจากระบบ</p>
          </button>
        </div>
      </div>

      {/* Overlay for mobile to close sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}
