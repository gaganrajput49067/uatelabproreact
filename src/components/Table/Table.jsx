import React, { useState, useEffect } from "react";
import "./Table.css";
import {
  getPaginatedData,
  calculateTotalPages,
  renderPaginationButtons,
  updateFixedColumns,
} from "./tableUtils";
import { SelectBox } from "../CommonComponent/SelectBox";
import TableSelectBox from "../TableComponent/TableSelectBox";

const Table = ({
  data = [],
  paginate = false,
  itemsPerPage = 10,
  fixCol = 0,
  children,
}) => {
  const [itemsPerPages, setItemPerPage] = useState(itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const [nowFixed, setNowFixed] = useState(false);

  useEffect(() => {
    updateFixedColumns(fixCol);
  }, [fixCol]);

  if (!paginate) {
    return (
      <div
        className="simple-table-container"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
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

  const currentItems = getPaginatedData(data, currentPage, itemsPerPages);
  const totalPages = calculateTotalPages(data, itemsPerPages);
  const finalIndex = 1 + (currentPage - 1) * itemsPerPages;
  console.log(itemsPerPages);
  return (
    <>
      <div
        className="simple-table-container"
        style={{
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        <table className="simple-table">
          {children({ currentItems, finalIndex })}
        </table>
      </div>

      {(data.length > itemsPerPages || nowFixed) && (
        <div className="pagination">
          <span className="fw-bold"> Items Per Page</span>&nbsp;&nbsp;&nbsp;
          <div style={{ display: "flex", alignItems: "center" }}>
            <TableSelectBox
              options={[
                { label: 5, value: 5 },
                { label: 10, value: 10 },
                { label: 15, value: 15 },
                { label: 20, value: 20 },
                { label: 30, value: 30 },
                { label: 40, value: 40 },
                { label: 50, value: 50 },
              ]}
              selectedValue={itemsPerPages}
              name="SelectTypes"
              id="SelectTypes"
              lable="No of Items Per Pages"
              onChange={(e) => {
                setItemPerPage(e.target.value);
                setNowFixed(true);
              }}
            />
            <span className="fw-bold">&nbsp;&nbsp;/{data.length}</span>
          </div>
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
