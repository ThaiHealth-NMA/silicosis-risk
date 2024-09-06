import React from "react";
import Link from "next/link";
import { MdNavigateNext } from "react-icons/md";

export default function MenuCard({ title, desc, icon: IconMenu, link, color }) {
  return (
    <Link
      href={`${link}`}
      className="bg-bases w-full rounded-xl overflow-hidden shadow-sm"
    >
      <div className="flex justify-between items-center p-3 gap-3">
        <div
          className={`flex justify-center items-center min-w-14 min-h-14 rounded-xl ${color}`}
        >
          <IconMenu className="text-bases text-2xl" />
        </div>
        <div className="flex justify-between w-full items-center">
          <div className="flex flex-col justify-center w-fit">
            <h2 className="text-xl font-semibold">{title}</h2>
            <h3 className="text-base text-neutral-dark">{desc}</h3>
          </div>
          <MdNavigateNext className="text-4xl text-neutral" />
        </div>
      </div>
    </Link>
  );
}
