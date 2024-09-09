import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the Quill editor

const TextEditor = ({ value, setValue, EditTable, setEditTable }) => {
  const [edit, setEdit] = useState(true);

  useEffect(() => {
    if (edit) {
      () => setValue(value); // Setting initial data only when the editor should edit.
    }
  }, [value, edit, setValue]);

  useEffect(() => {
    if (EditTable) {
      () => setValue(value); // Update editor data when EditTable is true.
    }
  }, [value, EditTable, setValue]);

  const onChange = (content) => {
    setEdit(false);
    setEditTable(false);
    setValue(content); // Update state with new content from the editor
  };

  return <ReactQuill value={value} onChange={onChange} />;
};

export default TextEditor;
