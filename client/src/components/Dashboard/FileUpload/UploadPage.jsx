import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFile, getUserFiles } from "../../../redux/slice/file/fileThunk";
import { toast } from "react-toastify";

const FileUploader = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [uploading, setUploading] = useState(false);

  const [files, setFiles] = useState([]);
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
    e.currentTarget.classList.remove("border-blue-500");
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-500");
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-500");
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    toast.info("File removed");
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please upload at least one file.");
      return;
    }

    const userId = user?._id || user?.id;
    if (!userId) {
      toast.error("Please sign in again before uploading files.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("userId", userId);
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

    setUploading(true);
    try {
      await dispatch(uploadFile(formData)).unwrap();
      toast.success("Files uploaded successfully!");
      setFiles([]);
      if (userId) {
        dispatch(getUserFiles(userId));
      }
    } catch (err) {
      let errorMsg =
        err?.error ||
        err?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" && !err.response.data.startsWith("<!") ? err.response.data : null);

      if (!errorMsg && err?.response?.status === 404) {
        errorMsg = "Backend API not found (404). Please ensure your backend is deployed and VITE_API_BASE_URL is set in Vercel.";
      } else if (!errorMsg) {
        errorMsg = "Upload failed. Please check network connection or server status.";
      }
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-10 text-[var(--text-color)] shadow-xl relative overflow-hidden group">
      <div className="text-center mb-8 relative z-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
          Upload to Cloud
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Drag & drop your files or browse from your device
        </p>
      </div>

      {/* Modern Dropzone */}
      <div
        className="border-2 border-dashed border-[var(--border-color)] hover:border-blue-500/50 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 bg-black/[0.02] dark:bg-white/[0.02] flex flex-col items-center justify-center group/drop"
        onClick={handleBrowseClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="w-16 h-16 rounded-2xl bg-black/5 dark:bg-white/5 flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover/drop:scale-110 shadow-inner">
          📁
        </div>
        <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Drop files here or click to browse
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-5 max-w-sm">
          Supported formats: Images, Videos, Audio, Documents, Archives (Max 10MB per file)
        </div>
        <button
          type="button"
          className="btn-primary text-sm shadow-sm"
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
          className="hidden"
          accept=".jpg,.jpeg,.webp,.png,.gif,.svg,.bmp,.ico,.tiff,.mp4,.avi,.mov,.mkv,.mk3d,.mks,.mka,.webm,.flv,.wmv,.mp3,.wav,.ogg,.m4a,.aac,.flac,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.json,.md,.rtf,.zip,.rar,.7z,.tar,.gz"
          onChange={handleFileInputChange}
        />
      </div>

      {/* Extra Options (Password & Expiry) */}
      <div className="mt-8 space-y-4">
        {/* Password Protection */}
        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">🔒</span>
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white block">Password Protection</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Require password before anyone can download</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enablePassword}
                onChange={(e) => setEnablePassword(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {enablePassword && (
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10">
              <input
                type="password"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="Set a secret download password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Expiry Date */}
        <div className="p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">⏳</span>
              <div>
                <span className="font-semibold text-sm text-gray-900 dark:text-white block">Auto Expiry</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">File link will expire automatically</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableExpiry}
                onChange={(e) => setEnableExpiry(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 dark:bg-[#333333] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          {enableExpiry && (
            <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10">
              <input
                type="datetime-local"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Files to upload ({files.length})
            </span>
            <span className="text-xs font-medium text-gray-500">
              Total: {(totalSize / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xl">📄</span>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(file.size / 1024).toFixed(2)} KB`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Action Button */}
      <div className="mt-8">
        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <span>Uploading to S3...</span>
            </>
          ) : (
            `Upload ${files.length > 0 ? `(${files.length} File${files.length > 1 ? "s" : ""})` : ""}`
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploader;
