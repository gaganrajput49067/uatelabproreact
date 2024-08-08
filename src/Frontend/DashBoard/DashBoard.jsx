import React, { useState } from "react";
import Table from "../../components/Table/Table";

const DashBoard = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const data = [
    { id: 1, name: "Piyush", age: 30, city: "New York", country: "USA" },
    { id: 2, name: "John", age: 25, city: "Los Angeles", country: "USA" },
    { id: 3, name: "Jane", age: 29, city: "Chicago", country: "USA" },
    { id: 4, name: "Doe", age: 35, city: "Houston", country: "USA" },
    { id: 5, name: "Alice", age: 28, city: "Phoenix", country: "USA" },
    { id: 6, name: "Bob", age: 32, city: "Philadelphia", country: "USA" },
    { id: 7, name: "Charlie", age: 27, city: "San Antonio", country: "USA" },
    { id: 8, name: "David", age: 33, city: "San Diego", country: "USA" },
    { id: 9, name: "Eve", age: 31, city: "Dallas", country: "USA" },
    { id: 10, name: "Frank", age: 36, city: "San Jose", country: "USA" },
    { id: 11, name: "Grace", age: 24, city: "Austin", country: "USA" },
    { id: 12, name: "Hank", age: 37, city: "Jacksonville", country: "USA" },
    { id: 13, name: "Ivy", age: 26, city: "Fort Worth", country: "USA" },
    { id: 14, name: "Jack", age: 34, city: "Columbus", country: "USA" },
    { id: 15, name: "Kelly", age: 23, city: "Charlotte", country: "USA" },
    { id: 16, name: "Leo", age: 29, city: "San Francisco", country: "USA" },
  ];

  return (
    <div>
      <h1>Table Example</h1>
      <div>
        <Table data={data}>
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
        </Table>
      </div>
    </div>
  );
};

export default DashBoard;
