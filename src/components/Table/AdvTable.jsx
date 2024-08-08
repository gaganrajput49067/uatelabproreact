import React, { useState, useRef, useEffect } from "react";
import "./Table.css";

const option = [
  { value: "1", label: "first" },
  { value: "2", label: "second" },
];

const defaultKeys = [
  {
    title: "Account",
    key: "account",
    searchable: true,
    feild: { name: "input", type: "text" },
  },
  { title: "Due Date", key: "dueDate", feild: { name: "input", type: "date" } },
  {
    title: "Amount",
    key: "amount",
    feild: { name: "input", type: "number" },
    oninput: (e) => {
      console.log(e.target.value);
    },
  },
  { title: "Period", key: "period" },
  {
    title: "Category",
    key: "category",
    feild: { name: "selectbox", option: option },
  },
  { title: "Description", key: "description" },
  { title: "Transaction Type", key: "transactionType" },
  { title: "Location", key: "location" },
  { title: "Reference", key: "reference", color: "grey" },
  { title: "Currency", key: "currency" },
  { title: "Tax", key: "tax" },
  { title: "Payment Method", key: "paymentMethod" },
  { title: "Discount", key: "discount" },
  { title: "Subtotal", key: "subtotal" },
  { title: "Project", key: "project" },
  { title: "Notes", key: "notes" },
  {
    title: "Status",
    key: "status",
    feild: { name: "input", type: "checkbox" },
  },
];

const defaultData = [
  {
    account: "Amex - 4321",
    dueDate: "09/01/2016",
    amount: "$1,000",
    period: "08/01/2016 - 08/31/2016",
    category: "Equipment",
    description: "New Laptops",
    transactionType: "Expense",
    location: "Seattle",
    reference: "INV-12350",
    currency: "USD",
    tax: "$100",
    paymentMethod: "Credit Card",
    discount: "$50",
    subtotal: "$850",
    total: "$1,000",
    vendor: "Best Buy",
    customer: "N/A",
    project: "IT Upgrade",
    notes: "Purchased 5 laptops",
    status: true,
  },
  {
    account: "Visa - 6543",
    dueDate: "10/01/2016",
    amount: "$2,000",
    period: "09/01/2016 - 09/30/2016",
    category: "Rent",
    description: "Office Rent",
    transactionType: "Expense",
    location: "Miami",
    reference: "INV-12351",
    currency: "USD",
    tax: "$200",
    paymentMethod: "Credit Card",
    discount: "$0",
    subtotal: "$1,800",
    total: "$2,000",
    vendor: "Realty Corp",
    customer: "N/A",
    project: "Monthly Rent",
    notes: "Office space rent",
    status: false,
  },
];

const AdvTable = ({
  keys = defaultKeys,
  data = [],
  paginate = true,
  itemsPerPage = 8,
  fixCol = 2,
  updateData,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({});
  const [searchableKey, setSearchableKey] = useState(null);
  const searchInputRef = useRef(null);

  const handleDoubleClick = (key) => {
    if (keys.find((col) => col.key === key)?.searchable) {
      setSearchableKey(key);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const handleSearchChange = (e) => {
    setFilters({ ...filters, [searchableKey]: e.target.value });
  };

  const handleClickOutside = (event) => {
    if (
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target)
    ) {
      setSearchableKey(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredData = data.filter((row) => {
    return Object.keys(filters).every((key) =>
      row[key]?.toLowerCase().includes(filters[key].toLowerCase())
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    if (totalPages <= 4) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? "active" : ""}
          >
            {i}
          </button>
        );
      }
    } else {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={1 === currentPage ? "active" : ""}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        buttons.push(<span key="left-ellipsis">...</span>);
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={i === currentPage ? "active" : ""}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        buttons.push(<span key="right-ellipsis">...</span>);
      }

      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={totalPages === currentPage ? "active" : ""}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  useEffect(() => {
    const headerCells = document.querySelectorAll(".simple-table th");
    const bodyCells = document.querySelectorAll(".simple-table td");

    headerCells.forEach((cell, index) => {
      if (index < fixCol) {
        cell.classList.add("fixed-column");
        const leftOffset = Array.from(headerCells)
          .slice(0, index)
          .reduce((acc, cell) => acc + cell.offsetWidth, 0);
        cell.style.left = `${leftOffset}px`;
      }
    });

    bodyCells.forEach((cell) => {
      const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
      if (cellIndex < fixCol) {
        cell.classList.add("fixed-column");
        const leftOffset = Array.from(cell.parentNode.children)
          .slice(0, cellIndex)
          .reduce((acc, cell) => acc + cell.offsetWidth, 0);
        cell.style.left = `${leftOffset}px`;
      }
    });
  }, [fixCol]);

  const handleInputChange = (e, rowIndex, key) => {
    const newValue =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const updatedData = [...data];
    updatedData[rowIndex][key] = newValue;
    updateData(updatedData);
  };

  return (
    <>
      <div className="simple-table-container">
        <table className="simple-table">
          <thead>
            <tr>
              {keys.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  onDoubleClick={() => handleDoubleClick(col.key)}
                >
                  {searchableKey === col.key ? (
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={filters[col.key] || ""}
                      onChange={handleSearchChange}
                      placeholder={`Search ${col.title}`}
                    />
                  ) : (
                    <>
                      {col.title}
                      {col.searchable && (
                        <>
                          &nbsp;&nbsp;&nbsp;
                          <i
                            className="fa fa-plus mt-1"
                            aria-hidden="true"
                            style={{ fontSize: "5px" }}
                          ></i>
                        </>
                      )}
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {keys.map((col) => (
                  <td key={col.key} data-label={col.title}>
                    {col.feild ? (
                      col.feild.name === "input" ? (
                        col.feild.type === "checkbox" ? (
                          <input
                            type="checkbox"
                            checked={row[col.key] || false}
                            onChange={(e) =>
                              handleInputChange(e, rowIndex, col.key)
                            }
                          />
                        ) : col.feild.type === "date" ? (
                          <input
                            type="date"
                            value={
                              row[col.key]
                                ? new Date(row[col.key])
                                    .toISOString()
                                    .substring(0, 10)
                                : ""
                            }
                            onChange={(e) =>
                              handleInputChange(e, rowIndex, col.key)
                            }
                          />
                        ) : col.feild.type === "number" ? (
                          <input
                            type="number"
                            value={Number(row[col.key]) || ""}
                            onChange={(e) =>
                              handleInputChange(e, rowIndex, col.key)
                            }
                            onInput={row[col.oninput]}
                          />
                        ) : (
                          <input
                            type={col.feild.type}
                            value={row[col.key] || ""}
                            onChange={(e) =>
                              handleInputChange(e, rowIndex, col.key)
                            }
                          />
                        )
                      ) : col.feild.name === "selectbox" ? (
                        <select
                          value={row[col.key] || ""}
                          onChange={(e) =>
                            handleInputChange(e, rowIndex, col.key)
                          }
                        >
                          {col.feild.option.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : null
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
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
          {renderPaginationButtons()}
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

export default AdvTable;
