import StockPriceTable from "../components/StockPriceTable";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Pagination from "../components/Pagination";
import Input from "../components/Input";
import { splitArrayIntoChunks } from "../utils/utils";
import Predictions from "../components/Predictions";
import VNIndex from "../components/VNIndex";
import Chat from "../components/Chat";

export default function HomePage({ data }) {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((currentPage) => currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((currentPage) => currentPage - 1);
  };

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  const [filter, setFilter] = useState("");
  const handleFilterChange = (e) => {
    setCurrentPage(1);
    setFilter(e.target.value);
  };
  let filteredData = data.sort(
    (item1, item2) =>
      item2["Content"]["TotalVol"] - item1["Content"]["TotalVol"]
  );
  if (filter !== "") {
    filteredData = data.filter((item) =>
      item["Content"]["Symbol"].startsWith(filter.toUpperCase())
    );
  }

  const chunks = splitArrayIntoChunks(filteredData, 10);
  return (
    <>
      <div className="flex flex-col gap-3 mx-10 my-5">
        <div className="flex flex-row justify-items-start">
          <Input
            icon={<IoIosSearch />}
            value={filter}
            onChange={handleFilterChange}
            placeholder="Finding stock symbol"
          />
        </div>
        <div className="flex flex-col gap-5">
          <StockPriceTable chunks={chunks} currentPage={currentPage} />
          <div className="flex flex-row justify-end">
            <Pagination
              total={chunks.length}
              currentValue={currentPage}
              onNextPage={handleNextPage}
              onPrevPage={handlePrevPage}
              onChangePage={handleChangePage}
            />
          </div>
        </div>
      </div>

      <VNIndex />

      <p className="my-6 mx-10 text-xl font-bold">Stock Price Forecasting</p>
      <div className="mx-10">
        <Predictions />
      </div>

      <Chat />
    </>
  );
}
