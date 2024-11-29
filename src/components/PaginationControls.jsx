import React from "react";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
    <div className="flex justify-between items-center mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-md">
        <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-32 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed mr-2"
        >
            Previous
        </button>
        <span className="text-sm text-gray-700 mx-4">
      Page {currentPage} of {totalPages}
    </span>
        <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-32 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed ml-2"
        >
            Next
        </button>
    </div>
);

export default PaginationControls;
