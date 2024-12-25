import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const PDFDragAndDrop = () => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = () => {
          // Handle file content (e.g., upload to server or preview)
          console.log('File content:', reader.result);
        };
        reader.readAsDataURL(file); // or readAsArrayBuffer for binary data
      } else {
        alert('Only PDF files are allowed!');
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'application/pdf', // Accept only PDF files
  });

  return (
    <>
    <h1>Upload pdf file</h1>

    <div
      {...getRootProps()}
      className='w-80 h-36 border-2 border-dashed border-[#ccc] p-5 text-center bg-gray-400]'
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the PDF files here...</p>
      ) : (
        <p>Drag & drop PDF files here, or click to select files</p>
      )}
    </div>

    </>
  );
};

export default PDFDragAndDrop;

// style={{
//     width: '400px',
//     height: '100px',
//     border: '2px dashed #ccc',
//     padding: '20px',
//     textAlign: 'center',
//     backgroundColor: isDragActive ? '#f0f8ff' : '#fff',
//     cursor: 'pointer',
//   }}