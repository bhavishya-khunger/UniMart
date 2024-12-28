import React, { useState } from "react";

const PdfUpload = () => {
  const [file, setFile] = useState(null); // Store the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // Store upload status or result
  const [fileUrl, setFileUrl] = useState(""); // Store the uploaded file's URL

  const apiKey = "ApEqdaLV4SGCYdvd2SmTEz"; // Replace with your Filestack API key

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update state with the selected file
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    try {
      setUploadStatus("Uploading...");
      // Make the POST request to Filestack
      const response = await fetch(
        `https://www.filestackapi.com/api/store/S3?key=${apiKey}`,
        {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setUploadStatus("File uploaded successfully!");
      setFileUrl(data.url); // Save the file URL in state
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    }
  };

  const [selectedVendor, setSelectedVendor] = useState(""); // State for selected vendor

const handleVendorSelection = (vendor) => {
  setSelectedVendor(vendor === selectedVendor ? "" : vendor); // Toggle vendor selection
};

  return (
    <>
      <section className="p-4">
        <h1 className="text-center text-3xl my-4 bg-pink-200 p-2 rounded-lg">
          Choose Your Vendor
        </h1>
        {/* Container for vendors */}
        <div className="flex items-center justify-evenly my-4">
          <div
            onClick={() => handleVendorSelection("Pankaj Graphics")}
            className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl text-white cursor-pointer ${
              selectedVendor === "Pankaj Graphics"
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
          >
            <img
              src="https://images.pexels.com/photos/29837298/pexels-photo-29837298/free-photo-of-christmas-gingerbread-cookies-in-teacup-setting.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt="Pankaj Graphics"
              className="h-[70%] w-[80%] rounded-xl"
            />
            <p>Pankaj Graphics</p>
          </div>
          <div
            onClick={() => handleVendorSelection("Rohit Graphics")}
            className={`flex flex-col items-center justify-center w-36 h-36 rounded-xl text-white cursor-pointer ${
              selectedVendor === "Rohit Graphics"
                ? "bg-orange-500"
                : "bg-blue-500"
            }`}
          >
            <img
              src="https://images.pexels.com/photos/29837298/pexels-photo-29837298/free-photo-of-christmas-gingerbread-cookies-in-teacup-setting.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
              alt="Rohit Graphics"
              className="h-[70%] w-[80%] rounded-xl"
            />
            <p>Rohit Graphics</p>
          </div>
        </div>
      </section>

      <section className="my-4 p-4">
        <h1 className="text-2xl text-center mb-4">Upload Your PDF File</h1>
        <form onSubmit={handleUpload} className="flex flex-col items-center">
          <label htmlFor="pdfFile" className="text-lg mb-2">
            Choose a PDF:
          </label>
          <input
            type="file"
            id="pdfFile"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mb-4"
          />

          <label htmlFor="comments" className="text-lg mb-2">
            Add Additional Comments:
          </label>
          <input
            type="text"
            id="comments"
            placeholder="Enter your comments here"
            className="mb-4 p-2 border border-gray-300 rounded-lg w-64"
          />

          <button
            type="submit"
            className="text-lg px-6 py-3 bg-orange-500 text-white font-bold rounded-full active:scale-95 hover:bg-orange-600"
          >
            Upload PDF
          </button>
        </form>
        {fileUrl && (
          <p className="mt-4 text-center">
            Given URL:{" "}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {fileUrl}
            </a>
          </p>
        )}
      </section>
    </>

    // <div style={{ textAlign: 'center', marginTop: '50px' }}>
    //   <h1>Upload Your PDF</h1>
    //   <form onSubmit={handleUpload} style={{ margin: '20px auto', display: 'inline-block' }}>
    //     <label htmlFor="pdfFile">Choose a PDF:</label>
    //     <input
    //       type="file"
    //       id="pdfFile"
    //       accept="application/pdf"
    //       onChange={handleFileChange}
    //       style={{ display: 'block', margin: '10px auto' }}
    //     />
    //     <button type="submit" style={{ padding: '10px 20px', background: '#007BFF', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
    //       Upload PDF
    //     </button>
    //   </form>
    //   <div style={{ marginTop: '20px', color: uploadStatus.includes('Error') ? 'red' : 'green' }}>
    //     {uploadStatus}
    //     {fileUrl && (
    //       <p>
    //         Access your file <a href={fileUrl} target="_blank" rel="noopener noreferrer"><p className='text-blue-500 font-bold'>here</p></a>.
    //       </p>
    //     )}
    //   </div>
    // </div>
  );
};

export default PdfUpload;
