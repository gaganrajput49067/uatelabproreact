import React from "react";

function AutoComplete({ test, handleListSearch,indexMatch }) {
  return (
    <div>
      <ul className="suggestion-data" >
        {test?.map((data, index) => (
          <li
            onClick={() => handleListSearch(data, "TestName")}
            className={`${index === indexMatch && "matchIndex"}`}
            key={index}
          >
            {data?.TestName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AutoComplete;
