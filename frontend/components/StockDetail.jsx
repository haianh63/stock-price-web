import { formatNumber } from "../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchStockDetail } from "../utils/dataFetching";
export default function StockDetail({ symbol, market }) {
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["details", symbol, market],
    queryFn: () => fetchStockDetail(symbol, market),
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="flex flex-row m-7 pb-7 border-b-slate-300 border-b-1">
      <div className="flex flex-col border-r-1 border-r-slate-300 pr-10">
        <p className="font-bold text-2xl">
          {symbol.toUpperCase()}{" "}
          <span className="font-semibold text-lg">
            ({market.toUpperCase()})
          </span>
        </p>
        <p className="font-medium">{data.EngCompanyName}</p>
      </div>

      <div className="grid grid-cols-3 text-sm w-1/2 gap-5 mx-5">
        <div>
          <p className="text-gray-400 font-semibold">Giá tham chiếu</p>
          <p className="font-bold">{formatNumber(data["RefPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Giá trần</p>
          <p className="font-bold">{formatNumber(data["CeilingPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Giá sàn</p>
          <p className="font-bold">{formatNumber(data["FloorPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Giá mở cửa</p>
          <p className="font-bold">{formatNumber(data["OpenPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Giá cao nhất</p>
          <p className="font-bold">{formatNumber(data["HighestPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-400 font-semibold">Giá thấp nhất</p>
          <p className="font-bold">{formatNumber(data["LowestPrice"])}</p>
        </div>
      </div>
    </div>
  );
}
