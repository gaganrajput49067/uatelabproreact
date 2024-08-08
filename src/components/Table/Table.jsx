// Table Usages
/* <Table data={data}>
          {({ currentItems, finalIndex }) => (
            <>
              <thead>
                <tr>
                  <th>S.no</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Country</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, rowIndex) => (
                  <tr key={row.id}>
                    <td>{rowIndex + finalIndex}</td>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.city}</td>
                    <td>{row.country}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </Table> */

import React, { useState, useEffect } from "react";
import "./Table.css";
import {
  filterData,
  getPaginatedData,
  calculateTotalPages,
  renderPaginationButtons,
  updateFixedColumns,
} from "./tableUtils";

const Table = ({
  data = [],
  paginate = true,
  itemsPerPage = 8,
  fixCol = 0,
  children,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Filter and paginate data
  const filteredData = filterData(data, filters);
  const currentItems = getPaginatedData(
    filteredData,
    currentPage,
    itemsPerPage
  );
  const totalPages = calculateTotalPages(filteredData, itemsPerPage);

  useEffect(() => {
    updateFixedColumns(fixCol);
  }, [fixCol]);

  let finalIndex = 1 + (currentPage - 1) * itemsPerPage;

  return (
    <>
      <div className="simple-table-container">
        <table className="simple-table">
          {children({ currentItems, finalIndex })}
        </table>
      </div>
      {paginate && filteredData.length > itemsPerPage && (
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
