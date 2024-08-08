// tableUtils.js
export const filterData = (data, filters) => {
  return data.filter((row) =>
    Object.keys(filters).every((key) =>
      row[key]?.toLowerCase().includes(filters[key].toLowerCase())
    )
  );
};

export const getPaginatedData = (filteredData, currentPage, itemsPerPage) => {
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  return filteredData.slice(indexOfFirstItem, indexOfLastItem);
};

export const calculateTotalPages = (filteredData, itemsPerPage) => {
  return Math.ceil(filteredData.length / itemsPerPage);
};

export const renderPaginationButtons = (
  totalPages,
  currentPage,
  handlePageChange
) => {
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

export const updateFixedColumns = (fixCol) => {
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
};
