import React, { useState, useEffect } from "react";
import "./Table.css";
import {
  getPaginatedData,
  calculateTotalPages,
  renderPaginationButtons,
  updateFixedColumns,
} from "./tableUtils";

const Table = ({
  data = [],
  paginate = false,
  itemsPerPage = 8,
  fixCol = 0,
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    updateFixedColumns(fixCol);
  }, [fixCol]);

  if (!paginate) {
    return (
      <div className="simple-table-container">
        <table className="simple-table">{children}</table>
      </div>
    );
  }

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const currentItems = getPaginatedData(data, currentPage, itemsPerPage);
  const totalPages = calculateTotalPages(data, itemsPerPage);
  const finalIndex = 1 + (currentPage - 1) * itemsPerPage;

  return (
    <>
      <div className="simple-table-container">
        <table className="simple-table">
          {children({ currentItems, finalIndex })}
        </table>
      </div>

      {data.length > itemsPerPage && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          {renderPaginationButtons(totalPages, currentPage, handlePageChange)}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </>
  );
};

export default Table;
