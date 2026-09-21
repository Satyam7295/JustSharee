const FilePreview = ({ file }) => {
  if (!file) {
    return null;
  }

  const previewUrl = file.previewUrl || file.downloadUrl || "";
  const fileType = (file.type || "").toLowerCase();
  const canPreviewImage = fileType.startsWith("image/");
  const canPreviewVideo = fileType.startsWith("video/");
  const canPreviewAudio = fileType.startsWith("audio/");
  const canPreviewPdf = fileType.startsWith("application/pdf");

  return (
    <div className="rounded-xl overflow-hidden bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 p-2">
      {previewUrl && canPreviewImage && (
        <img
          src={previewUrl}
          alt={file.name}
          className="w-full h-auto rounded-lg object-contain max-h-[60vh]"
        />
      )}

      {previewUrl && canPreviewVideo && (
        <video controls className="w-full h-auto rounded-lg max-h-[60vh]">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
      )}

      {previewUrl && canPreviewAudio && (
        <audio controls className="w-full h-auto rounded-lg">
          <source src={previewUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      )}

      {previewUrl && canPreviewPdf && (
        <iframe
          src={previewUrl}
          title={`${file.name} preview`}
          className="w-full h-[60vh] rounded-lg bg-white"
        />
      )}

      {(!previewUrl || (!canPreviewImage && !canPreviewVideo && !canPreviewAudio && !canPreviewPdf)) && (
        <div className="flex min-h-[220px] items-center justify-center rounded-lg border border-dashed border-gray-300 dark:border-white/10 px-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Preview is not available for this file type.
        </div>
      )}
    </div>
  );
};

export default FilePreview;