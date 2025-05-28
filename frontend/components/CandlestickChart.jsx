import { useQuery } from "@tanstack/react-query";
import { fetchIntraday, splitIntradayData } from "../utils/dataFetching";
import ReactECharts from "echarts-for-react";
export default function CandlestickChart({ symbol }) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["intraday", symbol],
    queryFn: () => fetchIntraday(symbol),
  });

  if (isPending) {
    return <span>Loading...</span>;
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
      padding: 10,
      textStyle: {
        color: "#000",
      },
      position: function (pos, params, el, elRect, size) {
        const obj = {
          top: 10,
        };
        obj[["left", "right"][+(pos[0] < size.viewSize[0] / 2)]] = 30;
        return obj;
      },
      // extraCssText: 'width: 170px'
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: "all",
        },
      ],
      label: {
        backgroundColor: "#777",
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
        left: "5%",
        right: "5%",
        top: "10%",
        bottom: "2%",
        height: "60%",
      },
      {
        left: "5%", // Increased left padding
        right: "5%", // Increased right padding
        top: "75%", // Adjusted top to accommodate the first grid
        bottom: "5%", // Added bottom padding
        height: "16%",
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
      },
    ],
    yAxis: [
      {
        scale: true,
        splitArea: {
          show: true,
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
      },
    ],
  };
  return <ReactECharts option={option} style={{ height: "600px" }} />;
  //   return <h1>Hi</h1>;
}
