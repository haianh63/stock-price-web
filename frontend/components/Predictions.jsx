import { useState } from "react";
import Prediction from "./Prediction";
const markets = [
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "HOSE",
  "UPCOM",
];
const symbols = [
  "VND",
  "VCI",
  "SSI",
  "HDB",
  "VPB",
  "BID",
  "VCB",
  "FPT",
  "CMG",
  "MFS",
];
export default function Predictions() {
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const symbol = symbols[currentPrediction];
  const market = markets[currentPrediction];
  console.log(symbol, market);
  const handleNextPrediction = () => setCurrentPrediction((curr) => curr + 1);
  const handlePrevPrediction = () => setCurrentPrediction((curr) => curr - 1);
  return (
    <>
      <button onClick={handlePrevPrediction}>Prev</button>
      <button onClick={handleNextPrediction}>Next</button>
      <Prediction symbol={symbol} market={market} />
    </>
  );
}
