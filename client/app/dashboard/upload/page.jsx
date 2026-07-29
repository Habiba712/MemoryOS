"use client";

import { useCallback, useRef, useState , useEffect} from "react";
import { UploadCloud, Image as ImageIcon, FileText, Play, Check, X } from "lucide-react";

export default function UploadPage() {
  const [items, setItems] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const [userId, setUserId] = useState(null);
const [token, setToken] = useState(null);
console.log("userId", userId)
  const handleFiles = useCallback((fileList) => {
    // if (!userId) return;
    if (!fileList || fileList.length === 0) return;

    const newItems = Array.from(fileList).map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      file,
      progress: 0,
      status: "uploading",
    }));

    setItems((prev) => [...newItems, ...prev]);
    newItems.forEach(uploadFile);
  }, [userId]);

  function uploadFile(item) {

    if (!userId) return;
    const formData = new FormData();
    formData.append("file", item.file);
    formData.append("user", userId);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.NEXT_PUBLIC_API_URL}/api/file/createFile`);

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const progress = Math.round((e.loaded / e.total) * 100);
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, progress } : i)));
    };

    xhr.onload = () => {
      const success = xhr.status >= 200 && xhr.status < 300;
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, progress: success ? 100 : i.progress, status: success ? "completed" : "error" }
            : i
        )
      );
    };

    xhr.onerror = () => {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, status: "error" } : i)));
    };

    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.send(formData);
  }

  function handleDrop(e) {
    if (!userId) return;
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem("sessionData"));

    if (!sessionData) return;

    setUserId(sessionData.userId);
    setToken(sessionData.token);
}, []);
  return (
    <div className="flex min-h-screen bg-gray-50 w-full">

      <main className="flex-1 px-8 py-6 max-w-3xl">
        <h1 className="text-xl font-semibold text-gray-900">Upload</h1>
        <p className="text-sm text-gray-500 mt-0.5 mb-6">Upload any file and let AI understand it for you.</p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center py-16 px-6 transition-colors ${
            isDragging ? "border-violet-400 bg-violet-50/60" : "border-gray-200 bg-white"
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="text-sm font-medium text-gray-900">Drag &amp; drop files here</p>
          <p className="text-xs text-gray-400 my-2">or</p>

          <button
            onClick={() => inputRef.current?.click()}
            className="bg-violet-600 hover:bg-violet-500 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-lg"
          >
            Choose Files
          </button>

          <input
            ref={inputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {items.length > 0 && (
          <div className="mt-6 space-y-3">
            {items.map((item) => (
              <UploadRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function UploadRow({ item }) {
  const { icon, iconBg } = fileIcon(item.file);
  const sizeLabel = formatBytes(item.file.size);
  const extension = item.file.name.split(".").pop()?.toUpperCase() ?? "";

  return (
    <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{item.file.name}</p>
        <p className="text-xs text-gray-400 mb-1.5">
          {extension} · {sizeLabel}
        </p>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${item.status === "error" ? "bg-red-400" : "bg-violet-500"}`}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>

      <span className="text-xs text-gray-400 w-9 text-right shrink-0">{item.progress}%</span>

      <div className="shrink-0">
        {item.status === "completed" && (
          <div className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
            <Check className="w-3 h-3" />
          </div>
        )}
        {item.status === "error" && (
          <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
            <X className="w-3 h-3" />
          </div>
        )}
        {item.status === "uploading" && (
          <div className="w-5 h-5 rounded-full border-2 border-gray-200 border-t-violet-500 animate-spin" />
        )}
      </div>
    </div>
  );
}

function fileIcon(file) {
  if (file.type.startsWith("image/")) {
    return { icon: <ImageIcon className="w-4 h-4 text-blue-600" />, iconBg: "bg-blue-50" };
  }
  if (file.type === "application/pdf") {
    return { icon: <FileText className="w-4 h-4 text-red-600" />, iconBg: "bg-red-50" };
  }
  if (file.type.startsWith("video/")) {
    return { icon: <Play className="w-4 h-4 text-violet-600" />, iconBg: "bg-violet-50" };
  }
  return { icon: <FileText className="w-4 h-4 text-gray-500" />, iconBg: "bg-gray-100" };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}