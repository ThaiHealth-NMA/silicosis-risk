import { useEffect, useState } from "react";
import axios from "axios";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@chakra-ui/react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function WorkingHearingLossChart() {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/working/hearingloss");
        const data = response.data;

        console.log(data);

        if (!Array.isArray(data)) {
          throw new Error("Data is not an array");
        }

        if (data.length === 0) {
          setNoData(true);
          console.log("No data available");
          return;
        }

        const scatterData = data.map((item) => ({
          x: item.noise,
          y: item.risk_level,
        }));

        setChartData({
          datasets: [
            {
              label: "ระดับความเสี่ยง : ระดับเสียง",
              data: scatterData,
              backgroundColor: "#ff3300",
              borderColor: "#ff9900",
              borderWidth: 1,
              pointRadius: 3,
            },
          ],
        });

        setNoData(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setNoData(true);
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
      <Scatter
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
                  return ` ระดับความเสี่ยง: ${context.raw.y}, ระดับเสียง : ${context.raw.x} dBA`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "ระดับเสียง (dBA)",
              },
              beginAtZero: true,
            },
            y: {
              title: {
                display: true,
                text: "ระดับความเสี่ยง",
              },
              beginAtZero: true,
            },
          },
        }}
      />
      <div className="text-center w-full py-2">
        ระดับความเสี่ยงการรับสัมผัสเสียงดังกับระดับเสียงดัง
      </div>
    </Box>
  );
}
