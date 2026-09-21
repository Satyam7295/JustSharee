import React, { useEffect, useState } from "react";
import Header from "../HeaderComp";
import GuestFilePreview from "./GuestFilePreview";
import GuestFileUpload from "./GuestFileUpload";
import Footer from "../Footer";

const GuestHomePage = () => {
    // This component serves as the main page for guest users to upload and preview files
    // take files from local storage and display them
   const [files, setFiles] = useState([]);

useEffect(() => {
  const storedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
  setFiles(storedFiles);
}, []);
 const updateFiles = (newFiles) => {
    setFiles(newFiles);
    localStorage.setItem("guestFiles", JSON.stringify(newFiles));
  };

  return (
    <div className="min-h-screen flex flex-col pt-24 text-[var(--text-color)] relative">
      <Header />
      
      {/* Removed background blurs */}

      <main className="flex-1 p-6 w-full max-w-6xl mx-auto flex flex-col gap-12 animate-fade-in">
        <div className="text-center mt-8 mb-4 max-w-2xl mx-auto">
          <h1 className="text-5xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white">
            Share Files Effortlessly
          </h1>
          <p className="text-lg text-gray-400 dark:text-gray-300 font-medium">
            Secure, fast, and minimal file sharing. Upload your files below to get started without needing an account.
          </p>
        </div>

        <GuestFileUpload guestFiles={files} updateFiles={updateFiles}/>
        
        {files.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <GuestFilePreview guestFiles={files} updateFiles={updateFiles} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default GuestHomePage;