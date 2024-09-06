import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function HearingLossChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/hearingloss");
        const data = response.data.data;

        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        if (data.length === 0) {
          setNoData(true);
          console.log("No data available");
          return;
        }

        const riskGroups = {
          ไม่มีนัยสำคัญ: 0,
          น้อย: 0,
          ปานกลาง: 0,
          สูง: 0,
          สูงมาก: 0,
        };

        for (let i = 0; i < data.length; i++) {
          const riskLevel = data[i].risk_level;

          if (riskLevel === 0) {
            riskGroups["ไม่มีนัยสำคัญ"]++;
          } else if (riskLevel < 2) {
            riskGroups["น้อย"]++;
          } else if (riskLevel < 3) {
            riskGroups["ปานกลาง"]++;
          } else if (riskLevel < 4) {
            riskGroups["สูง"]++;
          } else if (riskLevel < 5) {
            riskGroups["สูงมาก"]++;
          }
        }

        const labels = Object.keys(riskGroups);
        const values = Object.values(riskGroups);

        setChartData({
          labels,
          datasets: [
            {
              label: "จำนวนคน",
              data: values,
              backgroundColor: [
                "rgba(54,162,235,0.6)",
                "rgba(75,192,192,0.6)",
                "rgba(255,159,64,0.6)",
                "rgba(255,99,132,0.6)",
                "rgba(153,102,255,0.6)",
              ],
              borderColor: [
                "rgba(54,162,235,1)",
                "rgba(75,192,192,1)",
                "rgba(255,159,64,1)",
                "rgba(255,99,132,1)",
                "rgba(153,102,255,1)",
              ],
              borderWidth: 1,
            },
          ],
        });

        setNoData(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  if (noData) {
    return (
      <Box className="p-4 w-full h-fit rounded-3xl shadow-xl">
        <p className="text-center text-lg text-red-500">ไม่พบข้อมูล</p>
      </Box>
    );
  }

  return (
    <Box className="p-4 w-full h-fit rounded-3xl shadow-xl">
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (label) {
                    label += ": ";
                  }
                  if (context.parsed.y !== null) {
                    label += context.parsed.y;
                  }
                  return label;
                },
              },
            },
            datalabels: {
              anchor: "end",
              align: "top",
              formatter: (value) => value,
              font: {
                weight: "bold",
                size: 20,
              },
              color: "#444",
            },
          },
          scales: {
            x: {
              title: {
                display: false,
                text: "ระดับความเสี่ยงจากการรับสัมผัสเสียงดัง",
              },
            },
            y: {
              title: {
                display: true,
                text: "จำนวน (คน)",
              },
              beginAtZero: true,
            },
          },
        }}
      />
      <div className="text-center w-full py-2">
        ระดับความเสี่ยงจากการรับสัมผัสเสียงดัง
      </div>
    </Box>
  );
}
