import { useEffect, useState } from "react";
import axios from "axios";
 
 

function AddNewPdf({isClicked,setIsclicked}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [allImage, setAllImage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isVisible,setVisible]=useState(true)
  useEffect(() => {
    getPdf();
  }, []);
  const getPdf = async () => {
    const result = await axios.get("http://localhost:5000/get-files");
    console.log(result.data.data);
    setAllImage(result.data.data);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    console.log(title, file);

    const result = await axios.post(
      "http://localhost:5000/upload-files",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(result);
    if (result.data.status == "ok") {
      alert("Uploaded Successfully!!!");
      getPdf();
    }
  };

  return (
    <div className={isVisible ? "flex" : "hidden"}>
      <form className="formStyle" onSubmit={submitImage}>
        <br />
        <div className="flex gap-1 ml-10">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Title"
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
   
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept="application/pdf"
            required
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        </div>
        
        <div className="text-center">
          <button className="btn btn-primary" type="submit" onClick={() => {
            if (typeof setIsclicked === 'function') {
              setIsclicked(false);
            }
          }}>
            Submit
          </button>
        </div>
 
     
      </form>
  
    </div>
  );
}

export default AddNewPdf;