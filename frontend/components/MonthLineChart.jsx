import ReactECharts from "echarts-for-react";
import { formatNumber } from "../utils/utils";
import { fetchVNIndex } from "../utils/dataFetching";
import { useQuery } from "@tanstack/react-query";

export default function MonthLineChart() {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["vnindex", "month"],
    queryFn: () => fetchVNIndex("month"),
  });

  if (isPending) {
    return <div className="bg-white w-[1174px] h-[400px] md:h-[600px]"></div>;
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
        const [originalDate, value] = data[index];
        return `
          <div class="flex flex-col justify-center items-center opacity-80 gap-3 w-full h-full text-xs">
              <p class="font-semibold">${formatNumber(value)}</p>
              <p>${originalDate}</p>
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
      data: categories,
      axisLabel: {
        formatter: function (value, index) {
          const [originalDate] = data[index];
          return originalDate.slice(0, 5); // Extract DD/MM from DD/MM/YYYY
        },
      },
    },
    yAxis: {
      type: "value",
      interval: 10,
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
        data: values,
      },
    ],
  };

  return <ReactECharts option={option} style={{ height: "600px" }} />;
}
