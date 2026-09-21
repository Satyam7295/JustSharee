import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../../config/axiosInstance";
import { FaDownload, FaLock } from "react-icons/fa";
import FilePreview from "../../Dashboard/FilePreview";

const GuestDownload = () => {
  const { shortCode } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const previewFile = file
    ? {
        ...file,
        previewUrl: file.previewUrl,
      }
    : null;

  useEffect(() => {
  const controller = new AbortController();

  const fetchFile = async () => {
    try {
      const res = await axiosInstance.get(`/files/g/${shortCode}`, {
        signal: controller.signal,
      });
      const data = res.data;
      setFile(data);
      setIsProtected(data.isPasswordProtected);

      if (data.isPasswordProtected) {
        toast.info("🔒 This file is password protected. Please enter the password.");
      } 

    } catch (err) {
      const isCanceled = err?.name === "AbortError" || err?.code === "ERR_CANCELED" || err?.message === "canceled";
      if (!isCanceled) {
        setError(err.response?.data?.error || err.message || "Failed to fetch");
      }
    } finally {
      setIsLoading(false);
    }
  };

  fetchFile();

  return () => controller.abort();
}, [shortCode]);


  const handleDownload = async () => {
    try {
      const res = await axiosInstance.get(`/files/g/${shortCode}?download=true`);
      const link = document.createElement("a");
      link.href = res.data.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to download file.");
    }
  };





  const verifyFile = async () => {
    if (!password) {
      toast.warn("Please enter a password.");
      return;
    }

    try {
      const res = await axiosInstance.post(`/files/verifyGuestFilePassword`, {
        shortCode,
        password,
      });
      const result = res.data;
      if (result.success) {
        toast.success("✅ Password verified! You can now download the file.");
        setIsVerified(true);
      } else {
        toast.error("❌ Incorrect password. Try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong. Please try again.");
    }
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (isLoading || !file) return <div className="text-gray-300">Loading...</div>;

  return (
    <div className="guest-download-layout">
      <section className="guest-download-preview-column">
        <p className="guest-download-section-label">File preview</p>
        <div className="guest-download-preview-shell">

          {isProtected && !isVerified ? (
            <div className="guest-download-protected">
              <FaLock aria-hidden="true" />
              <p>This file is password protected. Verify your access to preview or download it.</p>
            </div>
          ) : (
            <FilePreview file={previewFile} />
          )}
        </div>
      </section>

      <section className="guest-download-details">
        <p className="guest-download-section-label">File details</p>
        <dl className="guest-download-meta">
          <div>
            <dt>File name</dt>
            <dd>{file.name}</dd>
          </div>
          <div>
            <dt>Uploaded</dt>
            <dd>{new Date(file.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</dd>
          </div>
          <div>
            <dt>File size</dt>
            <dd>{(file.size / 1024 / 1024).toFixed(2)} MB</dd>
          </div>
          <div>
            <dt>File type</dt>
            <dd>{file.type}</dd>
          </div>
        </dl>

        {isProtected && !isVerified && (
          <div className="guest-download-verification">
            <label htmlFor="guest-file-password">Password</label>
            <input
              id="guest-file-password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={verifyFile} className="guest-download-verify-button">
              Verify password
            </button>
          </div>
        )}

        {(!isProtected || isVerified) && (
          <button onClick={handleDownload} className="guest-download-button">
            <FaDownload aria-hidden="true" />
            Download file
          </button>
        )}
      </section>
    </div>
  );
};

export default GuestDownload;
