import React, { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { formatNumber } from "../utils/utils";
import { fetchVNIndex } from "../utils/dataFetching";
import { useQuery } from "@tanstack/react-query";

export default function WeekLineChart() {
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["vnindex", "week"],
    queryFn: () => fetchVNIndex("week"),
  });

  if (isPending) {
    return <div className="bg-white w-full h-[400px]"></div>;
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
    const values = data.map(([, value]) => parseFloat(value));
    const categories = data.map((_, index) => index.toString());
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
        const param = params[0];
        const index = param.dataIndex;
        const [originalTimestamp, value] = data[index];
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
          <div class="flex flex-col justify-center items-center opacity-80 gap-2 w-full h-full text-xs">
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
      textStyle: {
        fontSize: isMobile ? 16 : 18,
      },
    },
    grid: {
      left: isMobile ? "5%" : "2%",
      right: isMobile ? "5%" : "2%",
      bottom: isMobile ? "15%" : "2%",
      top: isMobile ? "15%" : "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
      axisLabel: {
        fontSize: isMobile ? 8 : 12,
        formatter: function (value, index) {
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
      axisLabel: {
        fontSize: isMobile ? 8 : 12,
      },
    },

    dataZoom: isMobile
      ? [
          {
            type: "inside",
            xAxisIndex: [0],
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            moveOnMouseWheel: false,
          },
          {
            type: "slider",
            xAxisIndex: [0],
            bottom: 10,
            height: 20,
          },
        ]
      : [],
    series: [
      {
        type: "line",
        symbol: "circle",
        symbolSize: isMobile ? 6 : 8,
        showSymbol: false,
        emphasis: {
          focus: "series",
          itemStyle: {
            color: "#1e90ff",
            borderColor: "#fff",
            borderWidth: 2,
          },
          symbolSize: isMobile ? 10 : 12,
        },
        areaStyle: {},
        data: values,
      },
    ],
    animation: isMobile ? false : true,
  };

  return (
    <div className="w-full h-[400px] md:h-[600px] bg-white">
      <ReactECharts
        ref={chartRef}
        option={option}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
}
