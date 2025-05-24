import StockPriceTable from "../components/StockPriceTable";
import LineChart from "../components/LineChart";

export default function HomePage({ onReceiveData, data }) {
  return (
    <>
      <button onClick={onReceiveData}>Receive Data</button>
      <StockPriceTable data={data} />
      <LineChart />
    </>
  );
}
