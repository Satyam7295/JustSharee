import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteFile, getUserFiles } from "../../redux/slice/file/fileThunk";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import { FaWhatsapp, FaTelegramPlane, FaInstagram, FaEnvelope, FaHeadset, FaDownload, FaTrashAlt } from "react-icons/fa"
import { toast } from "react-toastify";
import FilePreview from "./FilePreview";
import axiosInstance from "../../config/axiosInstance";

const FileShow = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { files } = useSelector((state) => state.file);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [shareQrCode, setShareQrCode] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user && user._id) {
      dispatch(getUserFiles(user._id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (shareFile?.shortUrl) {
      const fullUrl = `${window.location.origin}${shareFile.shortUrl}`;
      setQrLoading(true);
      setShareQrCode("");
      axiosInstance
        .get(`/qr?data=${encodeURIComponent(fullUrl)}`)
        .then((res) => {
          if (res.data?.qrCode) {
            setShareQrCode(res.data.qrCode);
          }
        })
        .catch((err) => {
          console.error("Failed to generate QR code:", err);
          toast.error("Failed to load QR code");
        })
        .finally(() => {
          setQrLoading(false);
        });
    } else {
      setShareQrCode("");
    }
  }, [shareFile]);

  const sortFileName = (filename)=>{
    // Sort the file name to ensure consistent display
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  }

  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent("Download file: " + fullUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent("Here’s your file: " + fullUrl)}`,
      copy: fullUrl,
    };
  }

  const downloadQRCode = () => {
    if (!shareQrCode) return;
    const link = document.createElement("a");
    link.href = shareQrCode;
    link.download = `qr-${shareFile?.name || "code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

// Filter logic
const filteredFiles = files?.filter((file) => {
  const nameMatch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
  const typeMatch = filterType ? file.type === filterType : true;
  
  const statusMatch = filterStatus
    ? filterStatus === "expired"
      ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
      : differenceInDays(new Date(file.expiresAt), new Date()) > 0
    : true;

  return nameMatch && typeMatch && statusMatch;
});

// Pagination logic
const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
const paginatedFiles = filteredFiles?.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

  const handleDeleteAll = async () => {
    if (!files?.length || deletingAll) return;

    const confirmed = window.confirm(
      `Delete all ${files.length} uploaded files? This action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingAll(true);
    try {
      await Promise.all(files.map((file) => dispatch(deleteFile(file._id)).unwrap()));
      toast.success("All uploaded files deleted");
    } catch (error) {
      toast.error(error?.error || "Some files could not be deleted");
      dispatch(getUserFiles(user._id));
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            📁 Your Uploaded Files
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage, preview, and share your uploaded files
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleDeleteAll}
            disabled={!files?.length || deletingAll}
            title="Delete all uploaded files"
            aria-label="Delete all uploaded files and start fresh"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/25 text-red-400/90 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold whitespace-nowrap shrink-0"
          >
            <FaTrashAlt className="text-[11px]" aria-hidden="true" />
            <span>{deletingAll ? "Clearing..." : "Start Fresh"}</span>
          </button>
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-gray-600 dark:text-gray-300">
            Showing {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-3 w-full lg:items-center mb-6">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 pr-4 py-2.5 w-full rounded-xl font-medium bg-[var(--surface-color)] border border-[var(--border-color)] placeholder-gray-400 text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Search by file name..."
            aria-label="Search"
          />
        </div>

        <select
          className="px-4 py-2.5 rounded-xl font-medium bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {[...new Set(files?.map((f) => f.type))].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2.5 rounded-xl font-medium bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>

        {(filterType || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="px-4 py-2.5 bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all text-sm font-semibold"
          >
            Reset
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl">
          <span className="text-4xl mb-3">📂</span>
          <p className="text-gray-500 dark:text-gray-400 text-base font-medium">No files uploaded yet</p>
          <p className="text-gray-400 text-xs mt-1">Switch to the "Upload Files" tab to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="glass-panel overflow-hidden border border-[var(--border-color)] rounded-2xl shadow-sm">
            <table className="min-w-full divide-y divide-[var(--border-color)] text-[var(--text-color)] text-sm">
              <thead className="bg-black/[0.02] dark:bg-white/[0.02] hidden md:table-header-group">
                <tr>
                  {["File Name", "Size", "Type", "Downloads", "Status", "Actions", "Expires", "Uploaded"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {paginatedFiles?.map((file) => {
                  const formattedSize =
                    file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                      : file.size > 1024
                      ? `${(file.size / 1024).toFixed(2)} KB`
                      : `${file.size} Bytes`;

                  const isExpired =
                    differenceInDays(new Date(file.expiresAt), new Date()) <= 0;

                  return (
                    <React.Fragment key={file._id}>
                      {/* Desktop Row */}
                      <tr className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] hidden md:table-row transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                          <span title={file.name}>{sortFileName(file.name)}</span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{formattedSize}</td>
                        <td className="px-5 py-4 text-gray-500">
                          <span className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5 text-xs font-mono">
                            {file.type ? file.type.split("/")[1] || file.type : "file"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{file.downloadedContent || 0}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                              file.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                            }`}
                          >
                            {file.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-color)] transition-colors"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => setShareFile(file)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary shadow-none"
                            >
                              Share
                            </button>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {isExpired ? (
                            <span className="text-red-500 font-medium">Expired</span>
                          ) : (
                            `In ${differenceInDays(new Date(file.expiresAt), new Date())} days`
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {formatDistanceToNowStrict(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </td>
                      </tr>

                      {/* Mobile Card */}
                      <tr className="block md:hidden p-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="block p-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white text-base">
                                📄 {sortFileName(file.name)}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {file.type} • {formattedSize}
                              </p>
                            </div>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                                file.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                              }`}
                            >
                              {file.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 my-3 py-2 border-y border-[var(--border-color)]">
                            <div>Downloads: {file.downloadedContent || 0}</div>
                            <div>
                              Expires:{" "}
                              {isExpired
                                ? "Expired"
                                : `${differenceInDays(new Date(file.expiresAt), new Date())} days`}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setPreviewFile(file)}
                              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 hover:bg-black/10 text-[var(--text-color)] text-center transition-colors"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => setShareFile(file)}
                              className="flex-1 py-2 rounded-xl text-xs font-semibold btn-primary text-center shadow-none"
                            >
                              Share
                            </button>
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-5 px-1">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-primary text-xs py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Previous
              </button>
              <span className="text-xs text-gray-500 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-primary text-xs py-2 px-4 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl max-w-2xl w-full border border-[var(--border-color)] animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-md">
                {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>
            <FilePreview file={previewFile} />
            <div className="mt-5 text-right">
              <button
                onClick={() => setPreviewFile(null)}
                className="btn-primary text-sm px-5 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[var(--border-color)] animate-fade-in">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                Share "{shareFile?.name}"
              </h3>
              <button
                onClick={() => setShareFile(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-[var(--text-color)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <a
                href={handleShare(shareFile.shortUrl).whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
              >
                <FaWhatsapp className="text-emerald-500 text-lg" />
                <span>WhatsApp</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).telegram || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
              >
                <FaTelegramPlane className="text-sky-500 text-lg" />
                <span>Telegram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).twitter}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
              >
                <span className="text-base">𝕏</span>
                <span>Twitter / X</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).email}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-[var(--border-color)] bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/5 dark:hover:bg-white/5 transition-all text-xs font-semibold"
              >
                <FaEnvelope className="text-rose-500 text-lg" />
                <span>Email</span>
              </a>
            </div>

            {/* QR Code and Copy Link */}
            <div className="p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-center flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Scan QR Code
              </p>
              <div className="w-32 h-32 rounded-lg border border-[var(--border-color)] p-1 bg-white mb-4 shadow-sm flex items-center justify-center">
                {qrLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : shareQrCode ? (
                  <img
                    src={shareQrCode}
                    alt="QR Code"
                    className="w-full h-full object-contain rounded"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Unavailable</span>
                )}
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={downloadQRCode}
                  disabled={!shareQrCode}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-color)] hover:bg-black/5 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <FaDownload />
                  <span>Download QR</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(handleShare(shareFile.shortUrl).copy);
                    toast.success("Link copied to clipboard!");
                  }}
                  className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold btn-primary flex items-center justify-center gap-1.5 shadow-none"
                >
                  <span>📋 Copy Link</span>
                </button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <button
                onClick={() => setShareFile(null)}
                className="text-xs text-gray-500 hover:text-[var(--text-color)] font-medium transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileShow;
