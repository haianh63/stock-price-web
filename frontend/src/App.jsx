import { useState, useEffect } from "react";
import { generateFakeData } from "../utils/utils";
import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import StockDetailPage from "../pages/StockDetailPage";
import { socket } from "./socket";
function App() {
  const [data, setData] = useState(generateFakeData(30));
  useEffect(() => {
    function onConnect() {
      console.log("Connected to server!!!");
    }

    function onConnectUpdate(data) {
      setData(data);
    }
    function onDisconnect() {
      console.log("Disconnected to server!!!");
    }

    function onReceiveUpdates(data) {
      // console.log(data);
      const symbol = data["Content"]["Symbol"];
      setData((prevData) => {
        const index = prevData.findIndex(
          (item) => item["Content"]["Symbol"] === symbol
        );

        if (index === -1) {
          return [...prevData, data];
        }

        const updatedData = [...prevData];
        updatedData[index] = data;
        return updatedData;
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("stock_update", onReceiveUpdates);
    socket.on("connect_update", onConnectUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("stock_update", onReceiveUpdates);
      socket.off("connect_update", onConnectUpdate);
    };
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage data={data} />} />
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
