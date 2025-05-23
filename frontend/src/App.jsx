import { useState, useEffect } from "react";
import StockPriceTable from "../components/StockPriceTable";
import { generateFakeData } from "../utils/utils";
import LineChart from "../components/LineChart";
import StockDetail from "../components/StockDetail";
import CandlestickChart from "../components/CandlestickChart";
function App() {
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState(generateFakeData(30));

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:5000/data");

    ws.onopen = () => {
      console.log("Websocket is connected!!!");
    };

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      console.log(data);
      setData(data);
    };

    ws.onclose = () => {
      console.log("Websocket is closed!!!");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const receiveData = () => {
    if (socket) {
      socket.send("receive-data");
    }
  };

  return (
    <div className="">
      <button onClick={receiveData}>Receive Data</button>
      <StockPriceTable data={data} />
      <LineChart />
      <StockDetail symbol="fpt" market="hose" />
      <CandlestickChart symbol="FPT" />
    </div>
  );
}

export default App;
