import React from "react";

const RiskBadge = ({ riskLevel }) => {
  const getRiskData = (riskLevel) => {
    let description = "ไม่พบข้อมูล";
    let style = "bg-neutral text-neutral-content";

    if (riskLevel === null || riskLevel === undefined) {
      description = "ไม่พบข้อมูล";
      style = "bg-neutral text-neutral-content";
    } else if (riskLevel === 0) {
      description = "ไม่มีนัยสำคัญ";
      style = "bg-risk-level-1 text-risk-level-1-content";
    } else if (riskLevel >= 0.01 && riskLevel <= 1.99) {
      description = "น้อย";
      style = "bg-risk-level-2 text-risk-level-2-content";
    } else if (riskLevel >= 2.0 && riskLevel <= 2.99) {
      description = "ปานกลาง";
      style = "bg-risk-level-3 text-risk-level-3-content";
    } else if (riskLevel >= 3.0 && riskLevel <= 3.99) {
      description = "สูง";
      style = "bg-risk-level-4 text-risk-level-4-content";
    } else if (riskLevel >= 4) {
      description = "สูงมาก";
      style = "bg-risk-level-5 text-risk-level-5-content";
    }

    return { description, style };
  };

  const { description, style } = getRiskData(riskLevel);

  return (
    <span
      className={`px-4 py-1 rounded-full font-bold text-xs text-center ${style}`}
    >
      {description}
    </span>
  );
};

export default RiskBadge;
