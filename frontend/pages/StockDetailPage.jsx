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
      <CandlestickChart symbol={symbol.toUpperCase()} />
    </>
  );
}
