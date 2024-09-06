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

export default function BmiChart() {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/health");
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        if (data.length === 0) {
          setNoData(true);
          console.log("No data available");
          return;
        }

        const bmiGroups = {
          น้ำหนักต่ำกว่าเกณฑ์: 0,
          สมส่วน: 0,
          น้ำหนักเกิน: 0,
          ภาวะอ้วน: 0,
          ภาวะอ้วนอันตราย: 0,
        };

        for (let i = 0; i < data.length; i++) {
          const bmi = data[i].bmi;

          if (bmi < 18.5) {
            bmiGroups["น้ำหนักต่ำกว่าเกณฑ์"]++;
          } else if (bmi < 23) {
            bmiGroups["สมส่วน"]++;
          } else if (bmi < 25) {
            bmiGroups["น้ำหนักเกิน"]++;
          } else if (bmi < 29.9) {
            bmiGroups["ภาวะอ้วน"]++;
          } else {
            bmiGroups["ภาวะอ้วนอันตราย"]++;
          }
        }

        const labels = Object.keys(bmiGroups);
        const values = Object.values(bmiGroups);

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
                display: true,
                text: "หมวดหมู่ BMI",
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
      <div className="text-center w-full py-2">ระดับดัชนีมวลกาย (BMI)</div>
    </Box>
  );
}
