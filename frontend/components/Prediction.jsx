import { useQuery } from "@tanstack/react-query";
import { fetchPredictions } from "../utils/dataFetching";
import { getWeekdays } from "../utils/utils";
import ReactECharts from "echarts-for-react";
import { formatNumber } from "../utils/utils";
export default function Prediction({ symbol, market }) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["predictions", symbol, market],
    queryFn: () => fetchPredictions(symbol, market),
  });

  if (isPending) {
    return <div className="bg-white w-full 670:w-[600px] h-[400px]"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  const dates = getWeekdays(7);
  const option = {
    tooltip: {
      position: function (pt) {
        return [pt[0], "10%"];
      },
      trigger: "axis", // Trigger tooltip on axis (shows for the entire vertical line)
      formatter: (params) => {
        const { name, value } = params[0]; // Access the first series' data
        return `<div class="flex flex-col justify-center items-center opacity-80 gap-3 w-full h-full text-xs">
                <p class="font-semibold">${formatNumber(Math.round(value))}</p>
                <div class="flex flex-col">
                    <p>${name}</p>
                </div>
            </div>`;
      },
    },
    xAxis: {
      type: "category",
      data: dates,
    },
    yAxis: {
      type: "value",
      min: Math.min(...data) - 50,
      max: Math.max(...data) + 50,
      axisLabel: {
        formatter: (value) => formatNumber(Math.round(value)),
      },
    },
    title: {
      left: "center",
      text: "FORECASTING",
    },
    grid: {
      left: "2%", // Reduced padding on the left
      right: "2%", // Reduced padding on the right
      bottom: "2%", // Reduced padding on the bottom
      containLabel: true, // Ensures labels fit within the grid
    },
    series: [
      {
        data: data,
        type: "line",
      },
    ],
  };
  return (
    <ReactECharts option={option} className="w-full 670:w-[600px] h-[400px]" />
  );
}
