import { useQuery } from "@tanstack/react-query";
import { fetchPredictions } from "../utils/dataFetching";
import { getWeekdays } from "../utils/utils";
import ReactECharts from "echarts-for-react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export default function Prediction({ symbol, market }) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["predictions", symbol, market],
    queryFn: () => fetchPredictions(symbol, market),
  });

  if (isPending) {
    return <div className="bg-white w-[600px] h-[400px]"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  const dates = getWeekdays(7);
  const option = {
    xAxis: {
      type: "category",
      data: dates,
    },
    yAxis: {
      type: "value",
      min: Math.min(...data) - 30,
      max: Math.max(...data) + 30,
    },
    series: [
      {
        data: data,
        type: "line",
      },
    ],
  };
  return (
    <ReactECharts option={option} style={{ height: "400px", width: "600px" }} />
  );
}
