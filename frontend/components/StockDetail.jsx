import { useEffect, useState } from "react";
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
    <div className="border border-gray-100 rounded-lg p-6 shadow-xl">
      <div className="grid grid-cols-2 gap-5">
        <div>
          <p className="text-gray-500">Giá tham chiếu</p>
          <p className="font-medium">{formatNumber(data["RefPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-500">Giá trần</p>
          <p className="font-medium">{formatNumber(data["CeilingPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-500">Giá sàn</p>
          <p className="font-medium">{formatNumber(data["FloorPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-500">Giá mở cửa</p>
          <p className="font-medium">{formatNumber(data["OpenPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-500">Giá cao nhất</p>
          <p className="font-medium">{formatNumber(data["HighestPrice"])}</p>
        </div>
        <div>
          <p className="text-gray-500">Giá thấp nhất</p>
          <p className="font-medium">{formatNumber(data["LowestPrice"])}</p>
        </div>
      </div>
    </div>
  );
}
