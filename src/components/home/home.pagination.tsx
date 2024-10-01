export const Pagination = ({ page, totalPages, setPage, darkMode }: any) => (
    <div className="mt-auto flex justify-center items-center py-5">
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`${darkMode ? 'bg-blue-950' : 'bg-blue-500'} text-white px-4 py-2`}
      >
        Previous
      </button>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        className={`${darkMode ? 'bg-blue-950' : 'bg-blue-500'} text-white px-4 py-2`}
      >
        Next
      </button>
    </div>
  );
  