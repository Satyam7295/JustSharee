import React from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { SiFsecure, SiReact, SiRedux, SiTailwindcss, SiNodedotjs, SiGithub } from "react-icons/si";
import { GoFileSubmodule } from "react-icons/go";
import { TbUpload } from "react-icons/tb";
import { FaFacebook, FaInstagram, FaLink, FaTwitter, FaShareSquare, FaLaptopCode } from "react-icons/fa";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="font-sans bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white text-center py-6">
        <h1 className="text-4xl font-bold tracking-tight">🚀 Share Pod</h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Fast, secure & simple file sharing solution</p>
      </header>

      {/* Hero Section */}
      <section className="bg-white dark:bg-[#0a0a0a] text-center py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white tracking-tight">File Sharing, Made Effortless</h2>
          <p className="text-lg mb-6 text-gray-600 dark:text-gray-400">
            Drag, upload, and share your files instantly. No hassle.
          </p>
          <Link to="/dashbaord">
            <button className="bg-black dark:bg-[#1c1c1e] text-white dark:text-[#f5f5f5] border border-black dark:border-[#2c2c2e] hover:bg-gray-800 dark:hover:bg-[#2c2c2e] transition-colors px-6 py-3 rounded-xl font-medium">
              Get Started Now
            </button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-800 py-14 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose Share Pod?</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-md transition">
            <IoMdCloudUpload size={60} className="mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Seamless Uploads</h3>
            <p className="text-gray-600 dark:text-gray-300">Upload large files easily and securely.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-md transition">
            <SiFsecure size={55} className="mx-auto mb-4 text-green-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Privacy First</h3>
            <p className="text-gray-600 dark:text-gray-300">Password-protected links with expiry options.</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow hover:shadow-md transition">
            <GoFileSubmodule size={55} className="mx-auto mb-4 text-purple-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Access Anywhere</h3>
            <p className="text-gray-600 dark:text-gray-300">Files available 24/7 across devices.</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white dark:bg-gray-900 py-14 px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">How it Works</h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <TbUpload size={55} className="mx-auto mb-4 text-orange-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Upload</h3>
            <p className="text-gray-600 dark:text-gray-300">Drag and drop your files into the uploader.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <FaLink size={55} className="mx-auto mb-4 text-blue-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Generate Link</h3>
            <p className="text-gray-600 dark:text-gray-300">Get a secure link to share instantly.</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow">
            <FaShareSquare size={55} className="mx-auto mb-4 text-pink-500" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Share</h3>
            <p className="text-gray-600 dark:text-gray-300">Send the link to your peers or clients.</p>
          </div>
        </div>
      </section>

      {/* Tools & Technologies */}
      <section className="bg-gray-50 dark:bg-gray-800 py-14 px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">Built With Modern Tools</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
            <SiReact size={40} className="text-cyan-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">React</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
            <SiRedux size={40} className="text-purple-500 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Redux Toolkit</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
            <SiTailwindcss size={40} className="text-sky-400 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Tailwind CSS</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow flex flex-col items-center">
            <SiNodedotjs size={40} className="text-green-600 mb-2" />
            <p className="font-medium text-gray-900 dark:text-white">Node.js (Backend)</p>
          </div>
        </div>
      </section>

      {/* Developer Info */}
      <section className="bg-white dark:bg-gray-900 py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <FaLaptopCode size={40} className="mx-auto text-gray-600 dark:text-gray-300 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Passionate MERN stack developer dedicated to building fast and user-friendly web experiences.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://github.com/Satyam7295"
              target="_blank"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
            >
              <SiGithub size={22} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 dark:bg-[#111111] border-y border-gray-200 dark:border-[#262626] text-gray-900 dark:text-white text-center py-12 px-4">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Start Sharing Today</h2>
        <Link to="/dashboard">
          <button className="bg-black dark:bg-[#1c1c1e] text-white dark:text-[#f5f5f5] border border-black dark:border-[#2c2c2e] hover:bg-gray-800 dark:hover:bg-[#2c2c2e] transition-colors px-6 py-3 rounded-xl font-medium">
            Upload Files
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white text-center py-6">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Share Pod. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="https://facebook.com" className="hover:text-blue-500 text-gray-500 dark:text-gray-400 transition-colors"><FaFacebook size={24} /></a>
          <a href="https://twitter.com" className="hover:text-sky-500 text-gray-500 dark:text-gray-400 transition-colors"><FaTwitter size={24} /></a>
          <a href="https://instagram.com" className="hover:text-pink-500 text-gray-500 dark:text-gray-400 transition-colors"><FaInstagram size={24} /></a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
