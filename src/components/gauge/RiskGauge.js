import ReactSpeedometer from "react-d3-speedometer";

const RiskGauge = ({ riskLevel }) => {
  return (
    <div className="flex items-center justify-center p-1">
      <ReactSpeedometer
        value={riskLevel || 0}
        minValue={0}
        maxValue={5}
        needleColor="red"
        startColor="green"
        endColor="red"
        segments={10}
        currentValueText={`ความเสี่ยงระดับ: ${riskLevel || 0}`}
        width={300}
        height={200}
      />
    </div>
  );
};

export default RiskGauge;
