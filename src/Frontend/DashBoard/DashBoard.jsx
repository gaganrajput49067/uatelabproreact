import React, { useState } from "react";
import PageHead from "../../components/CommonComponent/PageHead";
import SubPageHead from "../../components/CommonComponent/SubPageHead";
import { Button } from "react-bootstrap";
import CameraModal from "../utils/CameraModal";
import Table from "../../components/Table/STable";
import { sampleData } from "../../utils/sample";
import DataGridComponent from "../../components/Table/STable";
import STable from "../../components/Table/STable";

const DashBoard = () => {
  const [show, setShow] = useState(false);

  const [tableData, setTableData] = useState([
    {
      account: "Amex - 4321",
      dueDate: "09/01/2016",
      amount: "1000",
      period: "08/01/2016 - 08/31/2016",
      category: "1",
      description: "New Laptops",
      status: "Paid",
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
      amount: "2000",
      period: "09/01/2016 - 09/30/2016",
      category: "2",
      description: "Office Rent",
      status: "Pending",
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
  ]);

  const handleClose = () => {
    setShow(false);
  };

  // Update the table data
  const updateData = (newData) => {
    setTableData(newData);
  };

  return (
    <div>
      <h1>Table Example</h1>
      <STable
        data={tableData}
        updateData={updateData}
        paginate={true}
        itemsPerPage={5}
        fixCol={2}
      />
    </div>
  );
};

export default DashBoard;
