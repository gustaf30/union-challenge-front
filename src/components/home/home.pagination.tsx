import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const HomePagination = ({
  page,
  totalPages,
  darkMode,
  setPage,
  params,
  setParams,
}: any) => {
  const updateURLParams = () => {
    const updatedParams = new URLSearchParams(params);
    updatedParams.set("page", page);
    setParams(updatedParams);
  };

  const prevPage = () => {
    if (page == 1) return;
    setPage(page - 1);
    updateURLParams()
  };

  const nextPage = () => {
    if (page == totalPages && page != 1) return;
    setPage(page + 1);
    updateURLParams()
  };

  return (
    <div className="mt-auto flex justify-center items-center py-5">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={prevPage}
            className={`${
              darkMode
                ? "bg-blue-950 hover:bg-blue-900 text-white"
                : "bg-white hover:bg-gray-100"
            }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md cursor-pointer`}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>{page}</PaginationLink>
        </PaginationItem>
        <PaginationEllipsis />
        <PaginationItem>
          <PaginationLink>{totalPages}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={nextPage}
            className={`${
              darkMode
                ? "bg-blue-950 hover:bg-blue-900 text-white"
                : "bg-white hover:bg-gray-100"
            }  transition-colors duration-200 ease-in-out px-4 py-2 ml-2 rounded-md cursor-pointer`}
          />
        </PaginationItem>
      </PaginationContent>
    </div>
  );
};
