export const splitArrayIntoChunks = (arr, n) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += n) {
    const chunk = arr.slice(i, i + n);
    chunks.push(chunk);
  }

  return chunks;
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

const generateArray = (n) => {
  const arr = [];
  for (let i = 1; i <= n; ++i) {
    arr.push(i);
  }

  return arr;
};

export const generatePaginationArray = (total, currentValue) => {
  if (total <= 6) {
    return generateArray(total);
  }
  const threshold = 4;
  const arr = [];
  if (total + 1 - threshold <= currentValue && currentValue <= total) {
    arr.push(1);
    arr.push("...");
    for (let i = total - threshold; i <= total; ++i) {
      arr.push(i);
    }
    return arr;
  }
  if (1 <= currentValue && currentValue <= threshold) {
    for (let i = 1; i <= 1 + threshold; ++i) {
      arr.push(i);
    }
    arr.push("...");
    arr.push(total);
    return arr;
  }

  arr.push(1);
  arr.push("...");
  for (let i = currentValue - 1; i <= currentValue + 1; ++i) {
    arr.push(i);
  }
  arr.push("...");
  arr.push(total);

  return arr;
};

export const generateFakeData = (n) => {
  const data = [];
  for (let i = 0; i < n; ++i) {
    data.push({
      DataType: "X-TRADE",
      Content: {
        RType: "X-TRADE",
        TradingDate: "16/05/2025",
        Time: "14:45:00",
        Isin: "VCB",
        Symbol: "VCB",
        Ceiling: 62800,
        Floor: 54600,
        RefPrice: 58700,
        AvgPrice: 57500,
        PriorVal: 58700,
        LastPrice: 57500,
        LastVol: 400,
        TotalVal: 485712850000,
        TotalVol: 8364800,
        MarketId: "HOSE",
        Exchange: "HOSE",
        TradingSession: "C",
        TradingStatus: "N",
        Change: -1200,
        RatioChange: -2.04,
        EstMatchedPrice: 0,
        Highest: 59000,
        Lowest: 57500,
        Side: "SD",
      },
    });
  }

  return data;
};
