import { BASE_URL } from "./constants";
export const fetchIntraday = async (symbol) => {
  const result = await fetch(`${BASE_URL}/details/intraday`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ symbol: symbol }),
  });

  return result.json();
};

export const splitIntradayData = (rawData) => {
  let categoryData = [];
  let values = [];
  let volumes = [];
  for (let i = 0; i < rawData.length; i++) {
    categoryData.push(rawData[i]["Time"]);
    values.push([
      parseFloat(rawData[i]["Open"]),
      parseFloat(rawData[i]["Close"]),
      parseFloat(rawData[i]["Low"]),
      parseFloat(rawData[i]["High"]),
      parseFloat(rawData[i]["Volume"]),
    ]);
    volumes.push([
      i,
      parseFloat(rawData[i]["Volume"]),
      parseFloat(rawData[i]["Open"]) > parseFloat(rawData[i]["Close"]) ? 1 : -1,
    ]);
  }
  return {
    categoryData: categoryData,
    values: values,
    volumes: volumes,
  };
};

export const fetchVNIndex = async () => {
  const result = await fetch(`${BASE_URL}/vnindex`);
  return result.json();
};

export const fetchStockDetail = async (symbol, market) => {
  const result = await fetch(`${BASE_URL}/details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      symbol: symbol,
      market: market,
    }),
  });
  return result.json();
};
