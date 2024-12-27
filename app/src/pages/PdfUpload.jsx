import React, { useState } from 'react';

const PdfUpload = () => {
  const [file, setFile] = useState(null); // Store the selected file
  const [uploadStatus, setUploadStatus] = useState(''); // Store upload status or result
  const [fileUrl, setFileUrl] = useState(''); // Store the uploaded file's URL

  const apiKey = 'ApEqdaLV4SGCYdvd2SmTEz'; // Replace with your Filestack API key

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Update state with the selected file
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    try {
      setUploadStatus('Uploading...');
      // Make the POST request to Filestack
      const response = await fetch(`https://www.filestackapi.com/api/store/S3?key=${apiKey}`, {
        method: 'POST',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setUploadStatus('File uploaded successfully!');
      setFileUrl(data.url); // Save the file URL in state
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Error uploading file. Please try again.');
    }
  };

  return (
    <>
    <section>
    <h1 className='text-center text-3xl my-4 bg-pink-200'>Choose your vendor</h1>
    {/* Container for vendors */}

    {/* toggle functionality needs to be added */}
    <div className='flex items-center justify-evenly my-4'>
      <div className='flex flex-col items-center justify-center bg-blue-500 w-36 h-36 rounded-xl text-white'>
        <img src="https://images.pexels.com/photos/29837298/pexels-photo-29837298/free-photo-of-christmas-gingerbread-cookies-in-teacup-setting.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="shop" className='h-[70%] w-[80%] rounded-xl'/>
        <p>Pankaj Graphics</p>
      </div>
      <div className='flex flex-col items-center justify-center bg-blue-500 w-36 h-36 rounded-xl text-white'>
        <img src="https://images.pexels.com/photos/29837298/pexels-photo-29837298/free-photo-of-christmas-gingerbread-cookies-in-teacup-setting.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="shop" className='h-[70%] w-[80%] rounded-xl'/>
        <p>Rohit Graphics</p>
      </div>
    </div>
    </section>

    <section className='my-4'>
      <h1 className='text-2xl text-center'>Upload your PDF file</h1>
      <form action="" onSubmit={handleUpload}>
      <label htmlFor="pdfFile" className='text-lg'>Choose a PDF: </label>
      <input type="file"
      id='pdfFile'
      accept='application/pdf'
      onChange={handleFileChange} />

      <label htmlFor="comments" className='mt-5'>Add additional comments</label>
      <input type="text" name="" id="comments" />
      <button type='submit' className='text-lg px-5 py-4 bg-blue-500 text-white font-bold active:scale-95 rounded-full'>Upload pdf</button>
      </form>
      <p>Given URL: <a href={fileUrl} target="_blank" rel="noopener noreferrer">{fileUrl}</a></p>
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