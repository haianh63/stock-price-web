import DayLineChart from "./DayLineChart";
import MonthLineChart from "./MonthLineChart";
import WeekLineChart from "./WeekLineChart";
import { useState } from "react";
import clsx from "clsx";

const TIME_RANGES = [
  {
    label: "1 Day",
    element: <DayLineChart />,
  },
  {
    label: "1 Week",
    element: <WeekLineChart />,
  },
  {
    label: "1 Month",
    element: <MonthLineChart />,
  },
];
export default function VNIndex() {
  const [current, setCurrent] = useState(0);
  const LineChart = TIME_RANGES[current].element;
  return (
    <>
      <div className="rounded-lg border border-slate-200 shadow-xl mx-10 my-5 py-3">
        {LineChart}
      </div>
      <div className="flex flex-row mx-10 mt-8">
        {TIME_RANGES.map((item, index) => {
          return (
            <button
              key={item.label}
              onClick={() => setCurrent(index)}
              type="button"
              className={clsx(
                "text-gray-900 text-md font-medium rounded-lg px-5 py-2.5 me-2 mb-2 hover:cursor-pointer",
                current === index ? "bg-gray-100" : "bg-white"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
