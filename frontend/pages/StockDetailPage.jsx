import StockDetail from "../components/StockDetail";
import CandlestickChart from "../components/CandlestickChart";
import { useParams } from "react-router";

export default function StockDetailPage() {
  const { symbol, market } = useParams();
  return (
    <>
      <StockDetail
        symbol={symbol.toLowerCase()}
        market={market.toLowerCase()}
      />
      <div className="rounded-lg border border-slate-200 shadow-xl mx-10 my-5 py-3">
        <CandlestickChart symbol={symbol.toUpperCase()} />
      </div>
    </>
  );
}
