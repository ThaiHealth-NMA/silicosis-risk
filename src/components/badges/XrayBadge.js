import React from "react";

const XrayBadge = ({ xray }) => {
  const getRiskData = (xray) => {
    let description = "ไม่พบข้อมูล";
    let style = "bg-neutral text-neutral-content";

    if (xray === null || xray === undefined) {
      description = "ไม่พบข้อมูล";
      style = "bg-neutral text-neutral-content";
    } else if (xray === "ปกติ") {
      description = "ปกติ";
      style = "bg-risk-level-1 text-risk-level-1-content";
    } else if (xray === "ผิดปกติ") {
      description = "ผิดปกติ";
      style = "bg-risk-level-5 text-risk-level-5-content";
    }

    return { description, style };
  };

  const { description, style } = getRiskData(xray);

  return (
    <span
      className={`px-4 py-1 rounded-full font-bold text-xs text-center ${style}`}
    >
      {description}
    </span>
  );
};

export default XrayBadge;
