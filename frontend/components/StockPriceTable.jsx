import { formatNumber } from "../utils/utils";
import { clsx } from "clsx";
import { LuArrowUp, LuArrowDown } from "react-icons/lu";
import { useNavigate } from "react-router";
export default function StockPriceTable({ chunks, currentPage }) {
  return (
    <>
      <div className="overflow-hidden rounded-lg border border-slate-200 shadow-lg">
        <table className="w-full border-collapse table-auto">
          <thead className="bg-slate-50 text-sm font-medium text-slate-500 dark:bg-slate-900 dark:text-slate-400 rounded-t-lg text-center">
            <tr>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Mã cổ phiếu
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Giá hiện tại
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Thay đổi
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                % thay đổi
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Khối lượng giao dịch
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Giá trần
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Giá sàn
              </th>
              <th className="cursor-pointer px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-800">
                Sàn giao dịch
              </th>
            </tr>
          </thead>
          {chunks.length > 0 && (
            <tbody className="divide-y divide-slate-200 bg-white text-sm dark:divide-slate-700 dark:bg-slate-800 text-center">
              {chunks[currentPage - 1].map((item, idx) => (
                <StockPriceTableRow
                  key={`stockPriceRow-page-${currentPage}-idx-${idx}`}
                  item={item}
                />
              ))}
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}

function StockPriceTableRow({ item }) {
  const navigate = useNavigate();
  const symbol = item["Content"]["Symbol"];
  const lastPrice = item["Content"]["LastPrice"];
  const change = item["Content"]["Change"];
  const ratioChange = item["Content"]["RatioChange"];
  const totalVol = item["Content"]["TotalVol"];
  const ceiling = item["Content"]["Ceiling"];
  const floor = item["Content"]["Floor"];
  const exchange = item["Content"]["Exchange"];

  return (
    <tr
      key={symbol}
      className="transition-colors hover:bg-slate-50 hover:cursor-pointer dark:hover:bg-slate-900/50 text-center"
      onClick={() => navigate(`/details/${symbol}/${exchange}`)}
    >
      <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">
        {symbol}
      </td>
      <td className="px-6 py-4 font-medium dark:text-slate-100">
        {formatNumber(lastPrice)}
      </td>
      <td className="px-6 py-4 text-center dark:text-slate-100">
        <div
          className={clsx(
            "flex items-center justify-center font-medium",
            change > 0
              ? "text-emerald-600 dark:text-emerald-500"
              : change < 0
              ? "text-rose-600 dark:text-rose-500"
              : "text-amber-500 dark:text-amber-400"
          )}
        >
          {change > 0 ? (
            <LuArrowUp className="mr-1 h-4 w-4" />
          ) : change < 0 ? (
            <LuArrowDown className="mr-1 h-4 w-4" />
          ) : undefined}
          {change > 0 ? "+" : ""}
          {change.toFixed(2)}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span
          className={clsx(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
            ratioChange > 0
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500"
              : ratioChange < 0
              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-500"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500"
          )}
        >
          {ratioChange > 0 ? "+" : ""}
          {ratioChange.toFixed(2)}%
        </span>
      </td>
      <td className="px-6 py-4 font-medium dark:text-slate-100">
        {formatNumber(totalVol)}
      </td>
      <td className="px-6 py-4 font-medium dark:text-slate-100">
        {formatNumber(ceiling)}
      </td>
      <td className="px-6 py-4 font-medium dark:text-slate-100">
        {formatNumber(floor)}
      </td>
      <td className="px-6 py-4 dark:text-slate-100">{exchange}</td>
    </tr>
  );
}
