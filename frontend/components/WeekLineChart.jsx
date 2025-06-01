import ReactECharts from "echarts-for-react";
import { useEffect, useState } from "react";
import * as echarts from "echarts";
import { formatNumber } from "../utils/utils";
import { fetchVNIndex } from "../utils/dataFetching";
import { useQuery } from "@tanstack/react-query";

export default function WeekLineChart() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["vnindex", "week"],
    queryFn: () => fetchVNIndex("week"),
  });

  if (isPending) {
    return <div className="bg-white w-[1174px] h-[600px]"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const min = data.reduce(
    (min, item) => Math.min(min, parseFloat(item[1])),
    Infinity
  );
  const max = data.reduce(
    (max, item) => Math.max(max, parseFloat(item[1])),
    -Infinity
  );

  const formatData = () => {
    // For y-axis values
    const values = data.map(([, value]) => parseFloat(value));
    // For x-axis categories (use index or custom labels)
    const categories = data.map((_, index) => index.toString()); // Use index as category
    return { values, categories };
  };

  const { values, categories } = formatData();

  const option = {
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
      formatter: function (params) {
        const param = params[0]; // First series
        const index = param.dataIndex; // Index in the data array
        const [originalTimestamp, value] = data[index]; // Get original timestamp and value
        const date = new Date(originalTimestamp);
        const [formattedTime, formattedDate] = date
          .toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .split(" ");

        return `
          <div class="flex flex-col justify-center items-center opacity-80 gap-3 w-full h-full text-xs">
              <p class="font-semibold">${formatNumber(value)}</p>
              <div class="flex flex-col">
                  <p>${formattedDate}</p>
                  <p>${formattedTime} UTC+7</p>
              </div>
          </div>
        `;
      },
    },
    title: {
      left: "center",
      text: "VNINDEX",
    },
    grid: {
      left: "2%",
      right: "2%",
      bottom: "2%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories, // Use array indices as categories
      axisLabel: {
        formatter: function (value, index) {
          // Optionally, show original time or date for each point
          const [originalTimestamp] = data[index];
          const date = new Date(originalTimestamp);

          return echarts.format.formatTime("dd/MM", date);
        },
      },
    },
    yAxis: {
      type: "value",
      interval: 3,
      min: min,
      max: max,
    },
    series: [
      {
        type: "line",
        symbol: "circle",
        symbolSize: 8,
        showSymbol: false,
        emphasis: {
          focus: "series",
          itemStyle: {
            color: "#1e90ff",
            borderColor: "#fff",
            borderWidth: 2,
          },
          symbolSize: 12,
        },
        areaStyle: {},
        data: values, // Use only the values for the series
      },
    ],
  };

  return (
    <>
      <ReactECharts option={option} style={{ height: "600px" }} />
    </>
  );
}
