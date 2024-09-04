import React from "react";

const WorkStatusBadge = ({ workStatus }) => {
  const getWorkStatusData = (workStatus) => {
    let description = "ไม่พบข้อมูล";
    let style = "bg-neutral text-neutral-content";

    if (workStatus === null || workStatus === undefined) {
      description = "ไม่พบข้อมูล";
      style = "bg-neutral text-neutral-content";
    } else if (workStatus == "ไม่เคยทำครกหิน") {
      description = "ไม่เคยทำ";
      style = "bg-risk-level-0 text-risk-level-0-content";
    } else if (workStatus == "เคยทำครกหิน") {
      description = "เคยทำ";
      style = "bg-risk-level-2 text-risk-level-2-content";
    } else if (workStatus === "ทำครกหินอยู่") {
      description = "ทำอยู่";
      style = "bg-risk-level-1 text-risk-level-1-content";
    }

    return { description, style };
  };

  const { description, style } = getWorkStatusData(workStatus);

  return (
    <span
      className={`px-4 py-1 rounded-full font-bold text-xs text-center ${style}`}
    >
      {description}
    </span>
  );
};

export default WorkStatusBadge;
