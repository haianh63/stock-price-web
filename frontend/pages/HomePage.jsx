import StockPriceTable from "../components/StockPriceTable";
import LineChart from "../components/LineChart";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import Pagination from "../components/Pagination";
import Input from "../components/Input";
import { splitArrayIntoChunks } from "../utils/utils";
import Predictions from "../components/Predictions";

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
            placeholder="Tìm kiếm mã cổ phiếu"
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
      <div className="rounded-lg border border-slate-200 shadow-xl mx-10 my-5 py-3">
        <LineChart />
      </div>
      <p>Predictions</p>
      <Predictions />
    </>
  );
}
