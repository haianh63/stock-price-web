import { generatePaginationArray } from "../utils/utils";
import { clsx } from "clsx";
export default function Pagination({
  total,
  currentValue,
  onNextPage,
  onPrevPage,
  onChangePage,
}) {
  return (
    <div className="grid justify-center sm:flex sm:justify-start sm:items-center gap-2 font-semibold">
      <nav className="flex items-center gap-x-1" aria-label="Pagination">
        <button
          className="min-h-8 min-w-8 py-1.5 px-2 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
          onClick={onPrevPage}
          disabled={currentValue === 1}
        >
          Prev
        </button>
        <div className="flex items-center gap-x-1">
          <PaginationItems
            total={total}
            currentValue={currentValue}
            onChangePage={onChangePage}
          />
        </div>
        <button
          className="min-h-8 min-w-8 py-1.5 px-2 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:cursor-pointer hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
          onClick={onNextPage}
          disabled={currentValue === total}
        >
          Next
        </button>
      </nav>
    </div>
  );
}

function PaginationItems({ total, currentValue, onChangePage }) {
  const displayArray = generatePaginationArray(total, currentValue);
  return (
    <>
      {displayArray.map((value, idx) => (
        <button
          key={`pagination-idx-${idx}`}
          type="button"
          className={clsx(
            "min-h-8 min-w-8 flex justify-center items-center text-gray-800 hover:cursor-pointer hover:bg-gray-100 py-1.5 px-2.5 text-sm rounded-lg disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10",
            value === currentValue && "bg-gray-200 text-gray-800"
          )}
          onClick={() => onChangePage(value)}
          disabled={value === "..."}
        >
          {value}
        </button>
      ))}
    </>
  );
}
