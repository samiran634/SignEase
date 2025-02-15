import { useState } from "react";
import axios from "axios";

function AddNewPdf( ) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const submitImage = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a PDF file!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    try {
      const result = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(result);

      if (result.status === 200) {
        alert("Uploaded Successfully!");
         
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className= "flex">
      <form className="formStyle" onSubmit={submitImage}>
        <br />
        <div className="flex gap-1 ml-10">
          <div className="mb-3">
            <input
              type="text"
              className="form-control flex justify-center w-[8rem]"
              placeholder="Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <input
              type="file"
              className="form-control bg-black"
              accept="application/pdf"
              required
              onChange={(e) => setFile(e.target.files[0])}
              name="file"
              id="file"
            />
          </div>
        </div>

        <div className="text-center flex ml-10">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddNewPdf;
