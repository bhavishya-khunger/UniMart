import React, { useState } from "react";
import BottomNav from '../components/General/BottomNav'

const PdfUpload = () => {
  const [file, setFile] = useState(null); // Store the selected file
  const [uploadStatus, setUploadStatus] = useState(""); // Store upload status or result
  const [fileUrl, setFileUrl] = useState(""); // Store the uploaded file's URL
  const [comments, setComments] = useState("");

  const apiKey = import.meta.env.VITE_FILESTACK_API_KEY; // Access the environment variable using import.meta.env // Replace with your Filestack API key

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

  const vendors = ["Pankaj Graphics", "Rohit Graphics"];

  return (
    <>
      <section className="p-4">
        <h1 className="text-center text-2xl my-4 bg-orange-500 text-white p-2 rounded-lg shadow-lg">
          Choose Your Vendor
        </h1>
        {selectedVendor && `Chosen Vendor: ${selectedVendor}`}
        {/* Container for vendors  */}
        <div className="grid grid-cols-2 gap-4 my-4">
          {vendors && vendors.map((ven) => {
            return (
              <div
                key={ven}
                className={`w-full bg-gray-200 text-base italic py-3 px-4 rounded-2xl text-center cursor-pointer ${selectedVendor === ven ? "bg-orange-500 text-white" : ""}`}
                onClick={() => handleVendorSelection(ven)}
              >
                {ven}
              </div>
            );
          })}
        </div>
      </section>

      <section className="my-2 p-2 px-4">
        <h1 className="text-2xl text-center mb-4 text-gray-700 font-semibold">
          Upload Your PDF File
        </h1>
        <form onSubmit={handleUpload} className="flex flex-col items-center space-y-6">
          <div className="flex flex-col items-start w-full max-w-md">
            <label htmlFor="pdfFile" className="text-lg mb-2 text-gray-600">
              Choose a PDF:
            </label>
            <input
              required
              type="file"
              id="pdfFile"
              accept="application/pdf"
              onChange={handleFileChange}
              className="p-2 border-2 border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <div className="flex flex-col items-start w-full max-w-md">
            <label htmlFor="comments" className="text-lg mb-2 text-gray-600">
              Add Additional Comments:
            </label>
            <input
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              type="text"
              id="comments"
              placeholder="e.g. Print BW, Print on single page, Colored print"
              className="p-2 border-2 border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-gray-500"
            />
          </div>

          <button
            type="submit"
            className="text-lg px-6 py-3 bg-orange-500 text-white font-bold rounded-full transition-all duration-300 ease-in-out transform hover:bg-orange-600 hover:scale-105 active:scale-95"
          >
            Upload PDF
          </button>
        </form>
        {/* Sample container for checking URL */}
        {fileUrl && (
          <p className="mt-6 text-center text-gray-700">
            Given URL:{" "}
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              {fileUrl}
              {comments}
            </a>
          </p>
        )}
        {selectedVendor}
        {uploadStatus}
        {comments}
        <BottomNav />
      </section>
    </>
  );
};

export default PdfUpload;
