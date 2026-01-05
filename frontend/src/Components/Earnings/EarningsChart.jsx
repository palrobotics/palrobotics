import Chart from "react-apexcharts";
import { motion } from "framer-motion";
import { useEarningsChart } from "../../Hooks/useEarningsChart";

export default function EarningsChart() {
  const { data, loading } = useEarningsChart();

  if (loading || !data.length) {
    return (
      <div className="h-75 flex items-center justify-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed">
        {loading ? "Loading chart..." : "No earnings data available yet"}
      </div>
    );
  }
  const normalizeChartData = (rawData) => {
    if (!rawData.length) return [];

    const map = {};
    rawData.forEach((d) => {
      map[d.date] = d.total;
    });

    const dates = rawData.map((d) => new Date(d.date));
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));

    const filled = [];
    const cursor = new Date(start);

    while (cursor <= end) {
      const key = cursor.toISOString().split("T")[0];
      filled.push({
        date: key,
        total: map[key] || 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    return filled;
  };

  const chartData = normalizeChartData(data);

  const series = [
    {
      name: "Daily Earnings",
      data: chartData.map((d) => d.total),
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    stroke: {
      curve: "smooth",
      width: 3,
      colors: ["#f97316"],
    },

    xaxis: {
      type: "datetime",
      categories: chartData.map((d) => d.date),
      labels: {
        style: { colors: "#9ca3af" },
        datetimeUTC: false,
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#9ca3af" },
        formatter: (val) => `${val.toLocaleString()}`,
      },
    },
    tooltip: {
      x: { format: "dd MMM yyyy" },
      y: { formatter: (val) => `UGX ${val.toLocaleString()}` },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        colorStops: [
          { offset: 0, color: "#f97316", opacity: 0.4 },
          { offset: 100, color: "#f97316", opacity: 0.1 },
        ],
      },
    },
    dataLabels: { enabled: false },
    grid: {
      borderColor: "#f3f4f6",
      strokeDashArray: 4,
    },
    colors: ["#f97316"],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
    >
      <Chart options={options} series={series} type="line" height={300} />
    </motion.div>
  );
}
