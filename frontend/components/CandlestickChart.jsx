import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchIntraday, splitIntradayData } from "../utils/dataFetching";
import ReactECharts from "echarts-for-react";

export default function CandlestickChart({ symbol }) {
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["intraday", symbol],
    queryFn: () => fetchIntraday(symbol),
  });

  if (isPending) {
    return <div className="bg-white w-full h-[400px] md:h-[600px]"></div>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const upColor = "#00da3c";
  const downColor = "#ec0000";

  const splittedData = splitIntradayData(data);

  const option = {
    animation: false,
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      borderWidth: 1,
      borderColor: "#ccc",
      padding: isMobile ? 5 : 10,
      textStyle: {
        color: "#000",
        fontSize: isMobile ? 10 : 12,
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10,
        };
        obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#777",
        fontSize: isMobile ? 10 : 12,
      },
    },
    brush: {
      xAxisIndex: "all",
      brushLink: "all",
      outOfBrush: {
        colorAlpha: 0.1,
      },
    },
    visualMap: {
      show: false,
      seriesIndex: 1,
      dimension: 2,
      pieces: [
        {
          value: 1,
          color: downColor,
        },
        {
          value: -1,
          color: upColor,
        },
      ],
    },
    grid: [
      {
        left: isMobile ? "15%" : "5%",
        right: isMobile ? "15%" : "5%",
        top: isMobile ? "8%" : "10%",
        bottom: isMobile ? "15%" : "2%",
        height: isMobile ? "55%" : "60%",
      },
      {
        left: isMobile ? "6%" : "5%",
        right: isMobile ? "6%" : "5%",
        top: isMobile ? "70%" : "75%",
        bottom: isMobile ? "15%" : "5%",
        height: isMobile ? "14%" : "16%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: splittedData.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          z: 100,
        },
        axisLabel: {
          fontSize: isMobile ? 8 : 12,
        },
      },
      {
        type: "category",
        gridIndex: 1,
        data: splittedData.categoryData,
        boundaryGap: false,
        axisLine: { onZero: false },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        min: "dataMin",
        max: "dataMax",
        axisPointer: {
          z: 100,
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
        },
        axisLabel: {
          fontSize: isMobile ? 8 : 12,
        },
      },
      {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      },
    ],
    dataZoom: isMobile
      ? [
          {
            type: "inside",
            xAxisIndex: [0, 1],
            zoomOnMouseWheel: true,
            moveOnMouseMove: true,
            moveOnMouseWheel: false,
          },
          {
            type: "slider",
            xAxisIndex: [0, 1],
            bottom: 10,
            height: 20,
          },
        ]
      : [],
    series: [
      {
        name: symbol,
        type: "candlestick",
        data: splittedData.values,
        itemStyle: {
          color: upColor,
          color0: downColor,
          borderColor: undefined,
          borderColor0: undefined,
        },
      },
      {
        name: "Volume",
        type: "bar",
        xAxisIndex: 1,
        yAxisIndex: 1,
        data: splittedData.volumes,
        itemStyle: {
          color: upColor,
        },
      },
    ],
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
