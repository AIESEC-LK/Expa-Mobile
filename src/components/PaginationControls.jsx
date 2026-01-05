import React from "react";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
    <div>
        <div className="mx-auto max-w-3xl mr-3
                flex justify-between items-center
                px-4 py-2
                z-10">
            <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                    w-20 py-2 text-sm font-semibold
                    bg-gray-200 text-gray-700
                    rounded-md
                    hover:bg-gray-300
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                "
            >
                Previous
            </button>

            <span className="text-sm font-medium text-gray-700 mx-5">
                Page {currentPage} of {totalPages}
            </span>

            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="
                    w-20 py-2 text-sm font-semibold
                    bg-gray-200 text-gray-700
                    rounded-md
                    hover:bg-gray-300
                    disabled:bg-gray-300
                    disabled:cursor-not-allowed
                "
            >
                Next
            </button>
        </div>
    </div>
);

export default PaginationControls;
