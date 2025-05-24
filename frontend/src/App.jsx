import { useState, useEffect } from "react";
import { generateFakeData } from "../utils/utils";
import { Routes, Route, Link } from "react-router";
import HomePage from "../pages/HomePage";
import StockDetailPage from "../pages/StockDetailPage";

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
    <Routes>
      <Route
        index
        element={<HomePage onReceiveData={receiveData} data={data} />}
      />
      <Route path="details">
        <Route path=":symbol">
          <Route path=":market" element={<StockDetailPage />} />
        </Route>
      </Route>
      <Route path="*" element={<h1> 404 NOT FOUND!!! </h1>} />
    </Routes>
  );
}

export default App;
