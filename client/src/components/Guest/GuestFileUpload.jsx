import React, { useRef, useState } from "react";
import "./GuestFileUpload.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../config/axiosInstance";


const GuestFileUpload = ({guestFiles, updateFiles}) => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const [loading ,setLoading] = useState(false);

  const [files, setFiles] = useState(guestFiles || []);
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [enableExpiry, setEnableExpiry] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleFiles = (fileList) => {
    const list = Array.from(fileList);
    const validFiles = [];
    for (const file of list) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 10 MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length > 0) {
      setFiles((prev) => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} file(s) added!`);
    }
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("dragover");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("dragover");
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const handleUpload = async () => {
    setLoading(true);
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("hasExpiry", enableExpiry);

    if (enableExpiry && expiryDate) {
      const hours = Math.ceil(
        (new Date(expiryDate) - new Date()) / (1000 * 60 * 60)
      );
      formData.append("expiresAt", hours);
    }

    formData.append("isPassword", enablePassword);
    if (enablePassword && password) {
      formData.append("password", password);
    }

    try {
      const response = await axiosInstance.post(
        "/files/upload-guest",
        formData
      );
      console.log("Files uploaded:", response);
      if (
        !response.data ||
        typeof response.data !== "object" ||
        !response.data.message ||
        !Array.isArray(response.data.files)
      ) {
        throw new Error(
          "Upload API returned an invalid response. Check VITE_API_BASE_URL and your backend deployment."
        );
      }

      toast.success("Files uploaded successfully!");
      const newFiles = response.data.files;
      const updatedFiles = [...(guestFiles || []), ...newFiles];

      updateFiles(updatedFiles);
      setFiles([]);
    } catch (err) {
      let errorMsg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === 'string' && !err.response.data.startsWith('<!') ? err.response.data : null) ||
        err?.error ||
        err?.message;

      if (!errorMsg && err?.response?.status === 404) {
        errorMsg = "Backend API not found (404). Please ensure your backend is deployed and VITE_API_BASE_URL is configured in Vercel.";
      } else if (!errorMsg) {
        errorMsg = "Upload failed. Please check network connection or server status.";
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 md:p-10 text-[var(--text-color)] shadow-2xl relative overflow-hidden group">
      {/* Removed inner glow */}

      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Upload Files</h2>
        <p className="text-gray-400 font-medium">Drag & drop files or click to browse</p>
      </div>

      <div
        className="dropbox"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="dropbox-icon">📁</div>
        <div className="dropbox-text">Drop files here</div>
        <div className="dropbox-subtext">
          Supported formats: Images, Videos, Audio, Documents, Archives (Max 10MB)
        </div>
        <button
          className="browse-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleBrowseClick();
          }}
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept=".jpg,.jpeg,.webp,.png,.gif,.svg,.bmp,.ico,.tiff,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.webm,.flv,.wmv,.mp3,.wav,.ogg,.m4a,.aac,.flac,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.md,.rtf,.zip,.rar,.7z,.tar,.gz"
          onChange={handleFileInputChange}
        />
      </div>

      <div className="mt-8 space-y-4">
        {/* Password Option */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <span className="font-semibold text-gray-200">Set Password</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
          {enablePassword && (
            <div className="mt-4 animate-slide-up">
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Enter a secure password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Expiry Option */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 transition-all hover:bg-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <span className="font-semibold text-gray-200">Set Expiry Date</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={enableExpiry}
                onChange={(e) => setEnableExpiry(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
          {enableExpiry && (
            <div className="mt-4 animate-slide-up">
              <input
                type="datetime-local"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Summary</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-center flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{files.length}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Files Selected</span>
            </div>
            <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/5 text-center flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900 dark:text-white">{(totalSize / 1024).toFixed(2)} KB</span>
              <span className="text-sm text-gray-400 font-medium mt-1">Total Size</span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-400 mb-2 font-medium">
              <span>Capacity (5MB Limit)</span>
              <span>{Math.min((totalSize / (5 * 1024 * 1024)) * 100, 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(
                    (totalSize / (5 * 1024 * 1024)) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {files.length === 0 ? (
        <div className="mt-8 py-10 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl bg-white/5 text-gray-400">
          <span className="text-4xl mb-3 opacity-50">📂</span>
          <p className="font-medium">No files uploaded yet</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {files.map((file, index) => (
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group animate-slide-up" key={index}>
              <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center border border-white/5">
                {file.type.startsWith("image") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : file.type.startsWith("video") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">📄</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-200 truncate pr-4" title={file.name}>
                    {(() => {
                      const dotIndex = file.name.lastIndexOf(".");
                      const name = file.name.slice(0, dotIndex);
                      const ext = file.name.slice(dotIndex);
                      return name.length > 30
                        ? `${name.slice(0, 27)}...${ext}`
                        : file.name;
                    })()}
                  </p>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white transition-all md:opacity-0 md:group-hover:opacity-100"
                    onClick={() => removeFile(index)}
                    title="Remove file"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {file.size > 1024 * 1024
                    ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                    : `${(file.size / 1024).toFixed(2)} KB`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="upload-action">
        <button
          className="upload-btn"
          onClick={handleUpload}
          disabled={loading || files.length === 0}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default GuestFileUpload;
