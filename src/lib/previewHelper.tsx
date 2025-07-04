type FileTypes =
  | "image"
  | "video"
  | "audio"
  | "markdown"
  | "pdf"
  | "document"
  | "code"
  | "text"
  | "manga"
  | "executable";

/**
 * File extensions and their corresponding file types
 * Add more file extensions if needed
 */
const extensionsMap: Record<FileTypes, string[]> = {
  image: ["png", "jpg", "jpeg", "gif", "webp", "svg", "ico", "bmp", "avif"],
  video: [
    "mp4",
    "mkv",
    "webm",
    // "avi",
    // "mov",
    // "flv",
    // "wmv",
    "mpg",
    "mpeg",
    "m4v",
    "3gp",
  ],
  audio: ["mp3", "ogg", "wav", "flac", "m4a", "wma", "aac"],
  markdown: ["md"],
  pdf: ["pdf"],
  document: ["odt", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "csv"],
  executable: ["exe", "msi"],
  code: [
    "html",
    "css",
    "js",
    "ts",
    "tsx",
    "jsx",
    "vue",
    "py",
    "php",
    "go",
    "java",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "swift",
    "kt",
    "vb",
    "rs",
    "rb",
    "pl",
    "sh",
    "sql",
    "json",
    "xml",
    "yml",
    "yaml",
    "toml",
    "ini",
    "cfg",
    "env",
    "lock",
  ],
  text: ["txt"],
  manga: ["cbz"],
};

/**
 * Get file type based on file extension and mime type
 * @param fileExtension
 * @param mimeType
 * @returns FileTypes or "unknown"
 */
export function getFileType(fileExtension: string, mimeType: string): FileTypes | "unknown" {
  // Handle .ts video file
  if (fileExtension === "ts") {
    if (mimeType.includes("video")) {
      return "video";
    } else {
      return "code";
    }
  }
  const type = Object.keys(extensionsMap).find((key) =>
    extensionsMap[key as keyof typeof extensionsMap].includes(fileExtension),
  );

  return type ? (type as FileTypes) : "unknown";
}