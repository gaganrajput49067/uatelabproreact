import React from "react";

const BlockComponent = ({ userDashBoardData, userWiseDashBoard }) => {
  console.log(userDashBoardData, userWiseDashBoard);
  const data = [
    { title: "Total", value: "17K", backgroundColor: "rgb(249 91 103)" },
    { title: "Customers", value: "2K", backgroundColor: "rgb(35 201 139)" },
    {
      title: "Percentage",
      value: "10.50%",
      backgroundColor: "rgb(235 128 58)",
    },
    { title: "Orders", value: "489", backgroundColor: "rgb(239 39 27)" },
    {
      title: "Top Customer",
      value: "Isaac Dan",
      backgroundColor: "rgb(251 181 28)",
    },
    { title: "Booking", value: "2", backgroundColor: "rgb(206 28 251)" },
    { title: "Sample", value: "2", backgroundColor: "rgb(251 121 28)" },
  ];

  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    padding: "10px 0",
    margin: "0",
    width: "100%",
    justifyContent: "space-around",
  };

  const blockStyle = {
    padding: "20px",
    width: "13%",
    color: "#fff",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "18px",
    boxSizing: "border-box",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s ease-in-out",
  };

  return (
    <div style={containerStyle} className="w-100">
      {data.map((item, index) => (
        <div
          key={index}
          style={{ ...blockStyle, backgroundColor: item.backgroundColor }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <span style={{ fontSize: "24px", fontWeight: "bold" }}>
            {item.value}
          </span>
          <br />
          <span style={{ fontSize: "14px" }}>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default BlockComponent;
