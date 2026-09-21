import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNowStrict, differenceInDays } from "date-fns";
import {
  FaWhatsapp,
  FaTelegramPlane,
  FaInstagram,
  FaEnvelope,
  FaHeadset,
  FaDownload,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaEye, FaShare, FaTrashAlt, FaFolder, FaSearch } from "react-icons/fa";
import FilePreview from "../Dashboard/FilePreview";
import axiosInstance from "../../config/axiosInstance";

const GuestFilePreview = ({ guestFiles, updateFiles }) => {
  const dispatch = useDispatch();
  const [files, setFiles] = useState(guestFiles || []);
  const [previewFile, setPreviewFile] = useState(null);
  const [shareFile, setShareFile] = useState(null);
  const [shareQrCode, setShareQrCode] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const downloadQRCode = () => {
    if (!shareQrCode) return;
    const link = document.createElement("a");
    link.href = shareQrCode;
    link.download = `qr-${shareFile?.name || "code"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortFileName = (filename) => {
    // Sort the file name to ensure consistent display
    return filename.length > 20 ? `${filename.slice(0, 20)}...` : filename;
  };

  function handleShare(shortUrl) {
    const frontendBaseUrl = window.location.origin;
    const fullUrl = `${frontendBaseUrl}${shortUrl}`;

    return {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        "Download file: " + fullUrl
      )}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        fullUrl
      )}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        fullUrl
      )}&text=Check this out!`,
      email: `mailto:?subject=Shared File&body=${encodeURIComponent(
        "Here’s your file: " + fullUrl
      )}`,
      copy: fullUrl,
    };
  }

  const deleteFile = (fileId) => {
    if (!fileId) {
      toast.error("File ID is invalid.");
      return;
    }

    const updatedFiles = files.filter((file) => file.id !== fileId);

    setFiles(updatedFiles);
    if (updateFiles) {
      updateFiles(updatedFiles);
    } else {
      localStorage.setItem("guestFiles", JSON.stringify(updatedFiles));
    }

    toast.success("File deleted successfully!");
  };

  const performDeleteAll = () => {
    if (!files?.length || deletingAll) return;

    setDeletingAll(true);
    try {
      const updatedFiles = [];
      setFiles(updatedFiles);
      updateFiles(updatedFiles);
      setShowDeleteAllConfirm(false);
      toast.success("All uploaded files deleted");
    } catch (error) {
      toast.error(error?.message || "Some files could not be deleted");
    } finally {
      setDeletingAll(false);
    }
  };

  useEffect(() => {
    const hydrateGuestFiles = async () => {
      const nextFiles = await Promise.all(
        (guestFiles || []).map(async (file) => {
          if (file.previewUrl || file.downloadUrl || !file.shortUrl) {
            return file;
          }

          try {
            const shortCode = file.shortUrl.replace(/^\/g\//, "");
            const res = await axiosInstance.get(`/files/g/${shortCode}`);
            return {
              ...file,
              previewUrl: res.data.previewUrl,
            };
          } catch {
            return file;
          }
        })
      );

      setFiles(nextFiles);
    };

    hydrateGuestFiles();
  }, [guestFiles]);



  const filteredFiles = files?.filter((file) => {
    const nameMatch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const typeMatch = filterType ? file.type === filterType : true;

    const statusMatch = filterStatus
      ? filterStatus === "expired"
        ? differenceInDays(new Date(file.expiresAt), new Date()) <= 0
        : differenceInDays(new Date(file.expiresAt), new Date()) > 0
      : true;

    return nameMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.ceil((filteredFiles?.length || 0) / itemsPerPage);
  const paginatedFiles = filteredFiles?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <div className="flex flex-col mt-6 text-[#ededed] font-sans">
      <div className="flex justify-between items-center mb-4">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-[#ededed]">
          <FaFolder className="text-sm text-[#8b8b8b]" aria-hidden="true" />
          Your Uploaded Files
        </h2>
        <div className="flex items-center gap-2">
          <p className="text-xs text-[#8b8b8b]">
            Showing {filteredFiles.length} file{filteredFiles.length !== 1 && "s"}
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteAllConfirm(true)}
            disabled={!files?.length || deletingAll}
            aria-label="Delete all uploaded files"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-500/80 hover:text-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FaTrashAlt className="text-[10px]" aria-hidden="true" />
            <span>Delete all</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-2 w-full lg:items-center mb-5">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#666]" aria-hidden="true" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-9 pr-3 w-full rounded-md font-normal bg-[#111] border border-white/[0.08] placeholder-[#666] text-[#ededed] text-sm focus:outline-none focus:border-white/[0.18] focus:ring-1 focus:ring-white/[0.08] transition-colors duration-150"
            placeholder="Search by file name..."
            aria-label="Search"
          />
        </div>

        <select
          className="h-10 px-3 rounded-md font-normal bg-[#111] border border-white/[0.08] text-[#8b8b8b] text-sm focus:outline-none focus:border-white/[0.18] focus:ring-1 focus:ring-white/[0.08] transition-colors duration-150 outline-none cursor-pointer"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="" className="bg-gray-900 text-white">All Types</option>
          {[...new Set(files?.map((f) => f.type))].map((type) => (
            <option key={type} value={type} className="bg-gray-900 text-white">
              {type}
            </option>
          ))}
        </select>

        <select
          className="h-10 px-3 rounded-md font-normal bg-[#111] border border-white/[0.08] text-[#8b8b8b] text-sm focus:outline-none focus:border-white/[0.18] focus:ring-1 focus:ring-white/[0.08] transition-colors duration-150 outline-none cursor-pointer"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="" className="bg-gray-900 text-white">All Status</option>
          <option value="active" className="bg-gray-900 text-white">Active</option>
          <option value="expired" className="bg-gray-900 text-white">Expired</option>
        </select>

        {(filterType || filterStatus || searchTerm) && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterType("");
              setFilterStatus("");
            }}
            className="h-10 px-3 bg-transparent text-[#8b8b8b] border border-white/[0.08] rounded-md hover:bg-white/[0.05] hover:text-[#ededed] transition-colors duration-150 text-xs font-medium"
          >
            Reset
          </button>
        )}
      </div>

      {!files || files.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center border-y border-white/[0.08] mt-2">
          <p className="text-[#8b8b8b] text-sm">No files uploaded yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="min-w-[1080px]">
              <table className="w-full table-fixed text-[#ededed] text-[13px]">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[11%]" />
                  <col className="w-[14%]" />
                  <col className="w-[21%]" />
                  <col className="w-[14%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="text-[#666] hidden md:table-header-group">
                  <tr>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em]">File Name</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em]">Size</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] hidden lg:table-cell">Type</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em]">Actions</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] hidden md:table-cell">Expiry</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-[0.05em] hidden lg:table-cell">Uploaded</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.08]">
                  {paginatedFiles?.map((file) => {
                    const shareLinks = handleShare(file.shortUrl);
                    const formattedSize =
                      file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : file.size > 1024
                        ? `${(file.size / 1024).toFixed(2)} KB`
                        : `${file.size} Bytes`;

                    const isExpired =
                      differenceInDays(new Date(file.expiresAt), new Date()) <=
                      0;

                    return (
                      <>
                        {/* Desktop Row */}
                        <tr
                          key={file._id}
                          className="hover:bg-white/[0.025] hidden md:table-row transition-colors duration-150"
                        >
                          <td className="px-3 py-3 align-middle font-medium text-[14px] text-[#e5e5e5]" title={file.name}>
                            <span className="block truncate">{file.name}</span>
                          </td>
                          <td className="px-3 py-3 align-middle text-[13px] text-[#a1a1aa] whitespace-nowrap">
                            {formattedSize}
                          </td>
                          <td className="px-3 py-3 align-middle text-[13px] text-[#a1a1aa] hidden lg:table-cell truncate" title={file.type}>
                            {file.type}
                          </td>
                          <td className="px-3 py-3 align-middle whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setPreviewFile(file)}
                                className="inline-flex h-[34px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-white/[0.10] bg-white/[0.04] px-2 text-[12px] font-medium text-[#a1a1aa] transition-colors duration-150 ease-in-out hover:bg-white/[0.08] hover:text-[#ededed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                                title="Preview"
                                aria-label={`Preview ${file.name}`}
                              >
                                <FaEye className="text-[14px]" aria-hidden="true" />
                                <span>Preview</span>
                              </button>
                              <button
                                onClick={() => setShareFile(file)}
                                className="inline-flex h-[34px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-blue-500/[0.22] bg-blue-500/[0.08] px-2 text-[12px] font-medium text-blue-400 transition-colors duration-150 ease-in-out hover:border-blue-500/[0.35] hover:bg-blue-500/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                                title="Share"
                                aria-label={`Share ${file.name}`}
                              >
                                <FaShare className="text-[14px]" aria-hidden="true" />
                                <span>Share</span>
                              </button>
                              <button
                                onClick={() => deleteFile(file.id)}
                                className="inline-flex h-[34px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-white/[0.10] bg-white/[0.04] px-2 text-[12px] font-medium text-[#a1a1aa] transition-colors duration-150 ease-in-out hover:border-red-400/[0.25] hover:bg-red-400/[0.08] hover:text-[#f87171] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                                title="Delete"
                                aria-label={`Delete ${file.name}`}
                              >
                                <FaTrashAlt className="text-[14px]" aria-hidden="true" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-3 py-3 align-middle text-[13px] text-[#d99a3d] whitespace-nowrap hidden md:table-cell">
                            {isExpired
                              ? "Expired"
                              : `Expires in ${differenceInDays(
                                  new Date(file.expiresAt),
                                  new Date()
                                )} days`}
                          </td>
                          <td className="px-3 py-3 align-middle text-[13px] text-[#777] hidden lg:table-cell whitespace-nowrap">
                            {formatDistanceToNowStrict(
                              new Date(file.createdAt),
                              {
                                addSuffix: true,
                              }
                            )}
                          </td>
                        </tr>

                        {/* Mobile Card */}
                        <tr
                          key={`mobile-${file._id}`}
                          className="block md:hidden border-b border-white/[0.08]"
                        >
                          <td className="block px-4 py-4">
                            <div className="mb-2">
                              <strong className="text-[#ededed] font-medium">
                                {sortFileName(file.name)}
                              </strong>
                              <div className="text-xs text-[#8b8b8b]">
                                {file.type} | {formattedSize}
                              </div>
                            </div>
                            <div className="text-[13px] text-[#d99a3d] mb-1">
                              <span className="font-medium">Expiry:</span>{" "}
                              {isExpired
                                ? "Expired"
                                : `Expires in ${differenceInDays(
                                    new Date(file.expiresAt),
                                    new Date()
                                  )} days`}
                            </div>
                            <div className="text-sm text-gray-400 mb-1">
                              <span className="font-medium">Uploaded:</span>{" "}
                              {formatDistanceToNowStrict(new Date(file.createdAt), {
                                addSuffix: true,
                              })}
                            </div>

                            <div className="mt-3 flex items-center gap-1.5">
                             <button
                              onClick={() => setPreviewFile(file)}
                              className="inline-flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-white/[0.10] bg-white/[0.04] px-2 text-[12px] font-medium text-[#a1a1aa] transition-colors duration-150 ease-in-out hover:bg-white/[0.08] hover:text-[#ededed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
                              title="Preview"
                              aria-label={`Preview ${file.name}`}
                            >
                              <FaEye className="text-[14px]" aria-hidden="true" />
                            </button>

                            {/* Share */}
                            <button
                              onClick={() => setShareFile(file)}
                              className="inline-flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-blue-500/[0.22] bg-blue-500/[0.08] px-2 text-[12px] font-medium text-blue-400 transition-colors duration-150 ease-in-out hover:border-blue-500/[0.35] hover:bg-blue-500/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                              title="Share"
                              aria-label={`Share ${file.name}`}
                            >
                              <FaShare className="text-[14px]" aria-hidden="true" />
                              <span>Share</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => deleteFile(file.id)}
                              className="inline-flex h-[34px] flex-1 items-center justify-center gap-1.5 rounded-[7px] border border-white/[0.10] bg-white/[0.04] px-2 text-[12px] font-medium text-[#a1a1aa] transition-colors duration-150 ease-in-out hover:border-red-400/[0.25] hover:bg-red-400/[0.08] hover:text-[#f87171] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/50"
                              title="Delete"
                              aria-label={`Delete ${file.name}`}
                            >
                              <FaTrashAlt className="text-[14px]" aria-hidden="true" />
                              <span>Delete</span>
                            </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 px-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md text-xs text-[#8b8b8b] border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-40 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs text-[#666]">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md text-xs text-[#8b8b8b] border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-40 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
          <p className="text-[#666] mt-4 text-center text-xs">
  Want to save your progress?{" "}
  <Link
    to="/login"
    className="text-[#8b8b8b] hover:text-[#ededed] hover:underline transition-colors duration-150"
  >
    Log in
  </Link>{" "}
  or{" "}
  <Link
    to="/signup"
    className="text-[#8b8b8b] hover:text-[#ededed] hover:underline transition-colors duration-150"
  >
    Create an account
  </Link>
</p>

        </div>
      )}

      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl shadow-2xl max-w-md w-full border border-[var(--border-color)] animate-fade-in">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                <FaTrashAlt className="text-base" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Delete all files?
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
              This will permanently delete all uploaded files. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowDeleteAllConfirm(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/5 text-[var(--text-color)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={performDeleteAll}
                disabled={deletingAll}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {deletingAll ? "Deleting..." : "Delete all"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && createPortal(
        <div className="fixed inset-0 bg-white/80 dark:bg-black/90 flex items-start justify-center z-[9999] p-4 pt-20 sm:pt-28 animate-fade-in overflow-y-auto">
          <div className="glass-panel p-6 max-w-2xl w-full animate-slide-up relative">
            <button 
              onClick={() => setPreviewFile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-[var(--primary-text)] pr-6 truncate">{previewFile.name}</h3>
            <FilePreview file={previewFile} />
          </div>
        </div>,
        document.body
      )}

      {/* Share Modal */}
      {shareFile && createPortal(
        <div className="fixed inset-0 bg-white/80 dark:bg-black/90 flex items-start justify-center z-[9999] p-4 pt-20 sm:pt-28 animate-fade-in overflow-y-auto">
          <div className="glass-panel p-5 sm:p-6 max-w-lg w-full animate-slide-up relative">
            <button 
              onClick={() => setShareFile(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
            >
              &times;
            </button>
            <div className="flex justify-center mb-2">
              <img src="/filetransfergif.gif" alt="Share animation" className="w-16 h-16 object-contain opacity-90 dark:opacity-80" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center text-gray-900 dark:text-white truncate px-4">
              Share File
            </h3>

            <div className="grid grid-cols-2 gap-3 text-[var(--text-color)]">
              <a
                href={handleShare(shareFile.shortUrl).whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-green-500/50 transition-all group"
              >
                <FaWhatsapp className="text-green-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">WhatsApp</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).instagram || "#"}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-pink-500/50 transition-all group"
              >
                <FaInstagram className="text-pink-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Instagram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-500/50 transition-all group"
              >
                <FaTelegramPlane className="text-blue-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Telegram</span>
              </a>

              <a
                href={handleShare(shareFile.shortUrl).email}
                className="flex items-center justify-center gap-2 p-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 hover:border-red-500/50 transition-all group"
              >
                <FaEnvelope className="text-red-500 text-xl group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-sm">Email</span>
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-white/10 text-center">
              <p className="text-sm font-medium text-gray-400 mb-3">
                Or share via QR Code
              </p>
              <div className="bg-white p-2 rounded-xl inline-flex items-center justify-center shadow-lg mx-auto w-28 h-28">
                {qrLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : shareQrCode ? (
                  <img
                    src={shareQrCode}
                    alt="QR Code"
                    className="w-24 h-24 rounded-lg object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Unavailable</span>
                )}
              </div>
              <div className="flex flex-row justify-center gap-3 mt-4">
                <button
                  onClick={downloadQRCode}
                  disabled={!shareQrCode}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white rounded-xl disabled:opacity-50 transition-all"
                >
                  <FaDownload className="text-blue-400 text-lg" />
                  <span className="font-medium text-sm">Save QR</span>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      handleShare(shareFile.shortUrl).copy
                    );
                    toast.success("Link copied to clipboard!");
                  }}
                  className="flex-1 inline-flex justify-center items-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-white rounded-xl transition-all"
                >
                  <FaShare className="text-blue-400 text-lg" />
                  <span className="font-medium text-sm">Copy Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default GuestFilePreview;
