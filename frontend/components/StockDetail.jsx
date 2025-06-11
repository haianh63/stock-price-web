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
    <div className="flex flex-col lg:flex-row m-7 mx-10 pb-4 lg:pb-7 border-b border-slate-300 gap-4 lg:gap-0">
      {/* Company Info Section */}
      <div className="flex flex-col lg:border-r lg:border-slate-300 lg:pr-10 mb-4 lg:mb-0">
        <p className="font-bold text-xl lg:text-2xl">
          {symbol.toUpperCase()}{" "}
          <span className="font-semibold text-base lg:text-lg">
            ({market.toUpperCase()})
          </span>
        </p>
        <p className="font-medium text-sm lg:text-base">
          {data.EngCompanyName}
        </p>
      </div>

      {/* Price Info Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 text-xs lg:text-sm w-full lg:w-1/2 gap-3 lg:gap-5 lg:mx-5">
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Reference Price</p>
          <p className="font-bold">{formatNumber(data.RefPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Ceiling Price</p>
          <p className="font-bold">{formatNumber(data.CeilingPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Floor Price</p>
          <p className="font-bold">{formatNumber(data.FloorPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Open Price</p>
          <p className="font-bold">{formatNumber(data.OpenPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Highest Price</p>
          <p className="font-bold">{formatNumber(data.HighestPrice)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-[#61677A] font-semibold">Lowest Price</p>
          <p className="font-bold">{formatNumber(data.LowestPrice)}</p>
        </div>
      </div>
    </div>
  );
}
