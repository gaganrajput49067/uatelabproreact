export default function BrowseButton({ handleImageChange, accept }) {
  return (
    <>
      <input
        type="file"
        id="fileInput"
        onChange={handleImageChange}
        // style={{ display: "none" }}s
        accept={accept}
      />
      <button className="btn btn-sm">
        <label htmlFor="fileInput" className="text-white file-type-browse">
          Browse
        </label>
      </button>
    </>
  );
}
