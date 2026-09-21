import React from 'react'

function Footer() {
  return (
    <footer className="w-full mt-auto py-8 px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-gray-500 text-sm">
      <div className="flex items-center gap-6 glass-panel px-6 py-3 rounded-full">
        <span className="font-medium mr-2">Created by Satyam Kesherwani</span>
        {/* LinkedIn */}
        <a
          href="https://www.linkedin.com/in/satyam-kesherwani-529754257/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:-translate-y-1 transition-transform opacity-70 hover:opacity-100"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
            alt="LinkedIn"
            className="w-5 h-5 filter grayscale hover:grayscale-0 transition duration-300"
          />
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/Satyam7295"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:-translate-y-1 transition-transform opacity-70 hover:opacity-100 invert dark:invert-0"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/733/733553.png"
            alt="GitHub"
            className="w-5 h-5 transition duration-300"
          />
        </a>

        {/* Email */}
        <a
          href="mailto:work.satyamkesherwani@gmail.com"
          className="hover:-translate-y-1 transition-transform opacity-70 hover:opacity-100"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
            alt="Email"
            className="w-5 h-5 transition duration-300"
          />
        </a>
      </div>
    </footer>
  );
}


export default Footer
