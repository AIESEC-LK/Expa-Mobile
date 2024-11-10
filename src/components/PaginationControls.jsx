import React from "react";

const PaginationControls = ({ currentPage, totalPages, setCurrentPage }) => (
    <div className="flex justify-between items-center mt-4">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </div>
);

export default PaginationControls;
