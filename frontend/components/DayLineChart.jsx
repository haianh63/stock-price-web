import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { formatNumber } from "../utils/utils";
import { fetchVNIndex } from "../utils/dataFetching";
import { useQuery } from "@tanstack/react-query";

export default function DayLineChart() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["vnindex", "day"],
    queryFn: () => fetchVNIndex("day"),
  });

  if (isPending) {
    return <div className="bg-white w-[1174px] h-[600px]"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const min = data.reduce((min, item) => Math.min(min, item[1]), Infinity);
  const max = data.reduce((max, item) => Math.max(max, item[1]), -Infinity);
  const formatData = () => {
    const formattedData = data.map(([datetime, value]) => {
      let timestamp = new Date(datetime).getTime();
      const date = new Date(timestamp);
      const hours = date.getHours();
      if (hours >= 13) {
        timestamp -= 1.5 * 60 * 60 * 1000;
      }

      return [timestamp, value];
    });
    return formattedData;
  };

  const option = {
    tooltip: {
      trigger: "axis",
      position: function (pt) {
        return [pt[0], "10%"];
      },
      formatter: function (params) {
        const param = params[0]; // First series
        const timestamp = param.axisValue;
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        // Khôi phục thời gian gốc
        if (hours >= 12 || (hours === 11 && minutes >= 30)) {
          date.setTime(date.getTime() + 1.5 * 60 * 60 * 1000);
        }
        const [formattedTime, formattedDate] = date
          .toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .split(" ");
        const value = param.value[1];
        return `
            <div class="flex flex-col justify-center items-center opacity-80 gap-3 w-full h-full text-xs">
                <p class="font-semibold">${formatNumber(value)}</p>
                <div class="flex flex-col">
                    <p class="">${formattedDate}</p>
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
      left: "2%", // Reduced padding on the left
      right: "2%", // Reduced padding on the right
      bottom: "2%", // Reduced padding on the bottom
      containLabel: true, // Ensures labels fit within the grid
    },
    xAxis: {
      type: "time",
      boundaryGap: false,
      axisLabel: {
        formatter: function (value) {
          const date = new Date(value);
          const hours = date.getHours();
          const minutes = date.getMinutes();

          if (hours >= 12 || (hours === 11 && minutes >= 30)) {
            date.setTime(date.getTime() + 1.5 * 60 * 60 * 1000);
          }
          return echarts.format.formatTime("hh:mm", date);
        },
      },
    },
    yAxis: {
      type: "value",
      interval: 2,
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
        data: formatData(),
      },
    ],
  };

  return (
    <>
      <ReactECharts option={option} style={{ height: "600px" }} />
    </>
  );
}
