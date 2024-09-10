import React, { useState, useEffect, useRef } from "react";
import JoditEditor from "jodit-react";

const TextEditor = ({ value, setValue, EditTable, setEditTable }) => {
  const editorRef = useRef(null);
  const [edit, setEdit] = useState(true);

  // Jodit editor configuration
  const editorConfig = {
    height: "375px",
    toolbarSticky: true, // you can enable sticky toolbar if needed
    buttons: [
      "source", // equivalent to Source in CKEditor
      "|",
      "save",
      "newdoc",
      "print",
      "preview",
      "|",
      "cut",
      "copy",
      "paste",
      "pasteText",
      "pasteWord",
      "|",
      "undo",
      "redo",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "superscript",
      "subscript",
      "removeformat",
      "|",
      "ul",
      "ol",
      "outdent",
      "indent",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align", // equivalent to justify options
      "image",
      "table",
      "link",
      "hr",
      "eraser",
      "symbol",
      "fullsize", // equivalent to Maximize
      "selectall",
      "source",
    ],
    // Additional config settings
    uploader: {
      insertImageAsBase64URI: true, // Handle image uploads as base64
    },
    toolbarAdaptive: false, // Keep the toolbar non-adaptive for consistency
  };

  useEffect(() => {
    if (editorRef.current && edit) {
      editorRef.current.value = value;
    }
  }, [value, edit]);

  useEffect(() => {
    if (editorRef.current && EditTable) {
      editorRef.current.value = value;
    }
  }, [EditTable, value]);

  const onChange = (newContent) => {
    setEdit(false);
    setEditTable(false);
    setValue(newContent);
  };

  return (
    <div className="card">
      <JoditEditor
        ref={editorRef}
        value={value}
        config={editorConfig} // pass the configuration
        onBlur={onChange} // preferred to trigger updates when editor loses focus
      />
    </div>
  );
};

export default TextEditor;
