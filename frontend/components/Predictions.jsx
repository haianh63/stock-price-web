import { useState } from "react";
import Prediction from "./Prediction";
import { IoIosArrowDown } from "react-icons/io";
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
];
const symbols = ["VND", "VCI", "SSI", "HDB", "VPB", "BID", "VCB", "FPT", "CMG"];
export default function Predictions() {
  const [currentPrediction, setCurrentPrediction] = useState(0);
  const symbol = symbols[currentPrediction];
  const market = markets[currentPrediction];
  const handleSelect = (e) => setCurrentPrediction(e.target.value);
  return (
    <>
      <div className="w-full max-w-[200px] min-w-[100px]">
        <div className="relative">
          <select
            onChange={handleSelect}
            defaultValue={symbols[0]}
            className="font-semibold w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-500 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
          >
            {symbols.map((symbol, index) => (
              <option key={symbol} value={index} className="font-semibold">
                {symbol}
              </option>
            ))}
          </select>
          <IoIosArrowDown className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700" />
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 shadow-xl my-5 py-3 w-full 670:w-[600px]">
        <Prediction symbol={symbol} market={market} />
      </div>
    </>
  );
}
