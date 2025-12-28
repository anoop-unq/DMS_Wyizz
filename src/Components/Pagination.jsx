import React from "react";

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalItems === 0) return null;

  // --- Smart Page Number Logic ---
  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [1];
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 2) end = 3;
    if (currentPage >= totalPages - 1) start = totalPages - 2;

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (end < totalPages - 1) pages.push("...");
    
    pages.push(totalPages);
    return pages;
  };

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-[#F5F7FB] py-4 flex justify-end z-20 border-t border-gray-200/50 mt-auto">
      <div className="bg-white border border-gray-200 rounded-lg p-1 flex items-center space-x-1 shadow-sm">
        
        {/* PREVIOUS BUTTON */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {/* PAGE NUMBERS */}
        {getPageNumbers().map((pageNum, idx) => (
          <button
            key={idx}
            onClick={() => typeof pageNum === "number" && handlePageClick(pageNum)}
            className={`min-w-[32px] h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors
              ${
                pageNum === currentPage
                  ? "bg-[#7747EE] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }
              ${pageNum === "..." ? "cursor-default hover:bg-transparent" : ""}
            `}
          >
            {pageNum}
          </button>
        ))}

        {/* NEXT BUTTON */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-white bg-[#7747EE] rounded-md hover:bg-[#6338d1] ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;