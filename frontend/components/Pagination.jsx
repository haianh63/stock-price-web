import { generatePaginationArray } from "../utils/utils";
import { clsx } from "clsx";
export default function Pagination({
  total,
  currentValue,
  onNextPage,
  onPrevPage,
}) {
  return (
    <div className="flex flex-row gap-4">
      <button
        className="hover:cursor-pointer"
        onClick={onPrevPage}
        disabled={currentValue === 1}
      >
        Prev
      </button>
      <PaginationItems total={total} currentValue={currentValue} />
      <button
        className="hover:cursor-pointer"
        onClick={onNextPage}
        disabled={currentValue === total}
      >
        Next
      </button>
    </div>
  );
}

function PaginationItems({ total, currentValue }) {
  const displayArray = generatePaginationArray(total, currentValue);
  return (
    <>
      {displayArray.map((value, idx) => (
        <p
          key={`pagination-idx-${idx}`}
          className={clsx("", value === currentValue && "text-emerald-500")}
        >
          {value}
        </p>
      ))}
    </>
  );
}
