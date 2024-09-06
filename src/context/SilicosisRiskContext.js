import React, { createContext, useState, useContext } from "react";

const SilicosisRiskContext = createContext();

export const SilicosisRiskProvider = ({ children }) => {
  const [silicosisRiskScore, setSilicosisRiskScore] = useState(null);
  const [silicosisRiskLevel, setSilicosisRiskLevel] = useState(null);

  const calculateSilicosisRisk = (values) => {
    const { silicaDust, workingHours, diseases, workSeparation } = values;

    const X1 = parseFloat(silicaDust);
    const X2 = parseFloat(workingHours);
    const X3 = diseases === "ไม่มีโรคประจำตัว" ? 0 : 1;
    const X4 = workSeparation === "แยกจากที่พักอาศัย" ? 1 : 2;

    const riskScore =
      9.48 + 317.267 * X1 + 0.712 * X2 - 2.863 * X3 + 1.374 * X4;

    const constrainedRiskScore = Math.max(
      0,
      Math.min(25, parseFloat(riskScore.toFixed(2)))
    );

    const riskLevel = riskScore / 5;
    const constrainedRiskLevel = Math.max(
      0,
      Math.min(5, parseFloat(riskLevel.toFixed(1)))
    );

    setSilicosisRiskScore(constrainedRiskScore);
    setSilicosisRiskLevel(constrainedRiskLevel);

    console.log(`Calculated Hearing Loss Risk Score: ${constrainedRiskScore}`);
    console.log(`Categorized Risk Level: ${constrainedRiskLevel}`);
  };

  const resetSilicosisRisk = () => {
    setSilicosisRiskScore(null);
    setSilicosisRiskLevel(null);
  };

  return (
    <SilicosisRiskContext.Provider
      value={{
        silicosisRiskScore,
        silicosisRiskLevel,
        calculateSilicosisRisk,
        resetSilicosisRisk,
      }}
    >
      {children}
    </SilicosisRiskContext.Provider>
  );
};

export const useSilicosisRisk = () => useContext(SilicosisRiskContext);
