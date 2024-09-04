import React from "react";
import MenuCard from "./MenuCard";
import { GrUserWorker } from "react-icons/gr";
import { TbInfoTriangleFilled } from "react-icons/tb";
import { useRouter } from "next/router";
import { Button } from "@chakra-ui/react";
import { RiAdminLine } from "react-icons/ri";
import { PiGaugeFill } from "react-icons/pi";

const MenuData = [
  {
    title: "ประเมินความเสี่ยง",
    desc: "การรับสัมฝุ่นซิลิกา",
    icon: PiGaugeFill,
    color: "bg-accent",
    link: "/assessment/silicosis",
  },
  {
    title: "ลงทะเบียน",
    desc: "ผู้ประกอบอาชีพแกะสลักหิน",
    icon: GrUserWorker,
    color: "bg-primary",
    link: "/register/worker",
  },
  {
    title: "ข้อมูลข่าวสาร",
    desc: "อาชีวอนามัยและความปลอดภัย",
    icon: TbInfoTriangleFilled,
    color: "bg-error",
    link: "/info/occupational",
  },
];

export default function Menu() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-4 pt-2 max-w-[760px] mx-auto">
      <div className="flex flex-row justify-between items-center w-full">
        <h2 className="text-2xl font-semibold ml-1">เมนู</h2>
        <Button
          type="button"
          onClick={() => router.push("/admin/login")}
          colorScheme="blue"
          className="w-fit"
          fontSize="sm"
        >
          <RiAdminLine className="text-medium text-bases mr-1" />
          สำหรับเจ้าหน้าที่
        </Button>
      </div>
      {MenuData.map((menu, index) => (
        <MenuCard
          key={index}
          title={menu.title}
          desc={menu.desc}
          icon={menu.icon}
          color={menu.color}
          link={menu.link}
        />
      ))}
    </div>
  );
}
