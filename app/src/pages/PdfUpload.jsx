import React, { useContext, useEffect, useState } from "react";
import BottomNav from '../components/General/BottomNav';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';
import ErrorPop from '../components/General/ErrorPop';
import Loading from '../components/General/Loading';
import { useNavigate } from "react-router-dom";

const PdfUpload = () => {
  const [file, setFile] = useState(null); // Selected file
  const [uploadStatus, setUploadStatus] = useState(""); // Upload status or result
  const [fileUrl, setFileUrl] = useState(""); // Uploaded file's URL
  const [comments, setComments] = useState(""); // Additional comments
  const [vendors, setVendors] = useState([]); // List of vendors
  const [selectedVendor, setSelectedVendor] = useState(""); // Selected vendor
  const [error, setError] = useState(""); // Error message
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const navigate = useNavigate(); // Navigation hook

  const { user } = useContext(UserDataContext); // User data context

  // Fetch printers from the backend
  const getPrinters = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SHOP_BASE_URL}/get-printers`);
      setVendors(res?.data?.printers || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to fetch printers.");
      console.error(error);
    }
  };

  useEffect(() => {
    getPrinters();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update state with the selected file
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    if (!selectedVendor) {
      setError("Please select a vendor before uploading.");
      return;
    }

    try {
      setIsLoading(true); // Set loading state to true
      setUploadStatus("Uploading...");
      const response = await fetch(
        `https://www.filestackapi.com/api/store/S3?key=${import.meta.env.VITE_FILESTACK_API_KEY}`,
        {
          method: "POST",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed.");
      }

      const data = await response.json();
      setFileUrl(data.url);
      setUploadStatus("File uploaded successfully!");

      // Send the print request after successful upload
      await sendPrintRequest(data.url);
    } catch (error) {
      console.error("Error during file upload:", error);
      setUploadStatus("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  const sendPrintRequest = async (file) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_CART_BASE_URL}/print/request`, {
        fileLink: file,
        vendorId: selectedVendor,
        comments: comments,
        userId: user?._id,
      });

      if (response.status === 201) {
        setUploadStatus("Print request sent successfully!");
        navigate("/order");
      } else {
        throw new Error("Failed to send print request.");
      }
    } catch (error) {
      console.error("Error sending print request:", error);
      setError("Error sending print request. Please try again.");
    }
  };

  const handleVendorSelection = (vendorId) => {
    setSelectedVendor(vendorId === selectedVendor ? "" : vendorId); // Toggle vendor selection
  };

  return (
    <>
      <img
        src="https://img.freepik.com/free-vector/printing-invoices-concept-illustration_114360-4693.jpg"
        alt="Printing Invoices Illustration"
        className="h-32 w-full object-contain self-center"
      />
      {vendors.length === 0 ? (
        <div className="flex items-center justify-center">
          <ErrorPop text="This service is not available in your area." />
          <BottomNav />
        </div>
      ) : (
        <>
          {/* Vendor Selection */}
          <section className="p-4">
            <h1 className="text-center text-2xl my-4 bg-orange-500 text-white p-2 rounded-lg shadow-lg">
              Step 1: Choose Vendor
            </h1>
            <div className="grid grid-cols-2 gap-4 my-4">
              {vendors.map((vendor) => (
                <div
                  key={vendor?._id}
                  className={`w-full bg-gray-200 text-base italic py-3 px-4 rounded-2xl text-center cursor-pointer ${selectedVendor === vendor?._id ? "bg-gray-500 text-white" : ""
                    }`}
                  onClick={() => handleVendorSelection(vendor?._id)}
                >
                  {vendor?.shopName}
                </div>
              ))}
            </div>
          </section>

          {/* PDF Upload Form */}
          <section className="my-2 p-2 px-4">
            <h1 className="text-center text-2xl mb-3 bg-orange-500 text-white p-2 rounded-lg shadow-lg">
              Step 2: Upload Your PDF
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
                  placeholder="e.g., Print BW, Single Page, Colored Print"
                  className="p-2 border-2 border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-gray-500"
                />
              </div>
              {error && <ErrorPop text={error} />}
              {isLoading && <Loading />}
              {uploadStatus && <p className="mt-3 italic font-semibold">{uploadStatus}</p>}
              <button
                type="submit"
                className="text-lg px-6 py-3 bg-orange-500 text-white font-bold rounded-full transition-all duration-300 ease-in-out transform hover:bg-orange-600 hover:scale-105 active:scale-95"
              >
                Upload PDF
              </button>
              <div className="h-20"></div>
            </form>
          </section>
          <BottomNav />
        </>
      )}
    </>
  );
};

export default PdfUpload;
