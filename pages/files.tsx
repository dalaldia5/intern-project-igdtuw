import { useState, useRef, useEffect } from "react";
import Layout from "../components/Layout";

interface FileItem {
  id: string;
  name: string;
  type: "document" | "image" | "presentation";
  icon: string;
}

interface LinkItem {
  id: number;
  title: string;
  url: string;
  category: string;
}

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([
    {
      id: 1,
      title: "Tailwind CSS Documentation",
      url: "https://tailwindcss.com/docs",
      category: "Design Reference",
    },
    {
      id: 2,
      title: "Chart.js Examples",
      url: "https://www.chartjs.org/docs/latest/samples/",
      category: "Frontend Lib",
    },
  ]);

  const [showAddLinkModal, setShowAddLinkModal] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkCategory, setNewLinkCategory] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Use environment variable (auto switches between localhost & Render)
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  // ✅ Fetch all files from backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE}/files/files`);
        const data = await res.json();
        if (res.ok) {
          setFiles(
            data.map((file: any) => ({
              id: file._id,
              name: file.filename,
              type: "document",
              icon: "📄",
            }))
          );
        }
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, [API_BASE]);

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // ✅ Upload file
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/files/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ File uploaded successfully!");
        setUploadedFile(data.file.filename);
        setFiles((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            name: data.file.filename,
            type: "document",
            icon: "📄",
          },
        ]);
      } else {
        alert(`❌ Upload failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading file!");
    }
  };

  // ✅ Delete file
  const handleDeleteFile = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) return;

    try {
      const res = await fetch(`${API_BASE}/files/file/${filename}`, {
        method: "DELETE",
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Unexpected response (HTML returned instead of JSON)" };
      }

      if (res.ok) {
        alert("✅ File deleted successfully!");
        setFiles((prev) => prev.filter((f) => f.name !== filename));
      } else {
        alert(`❌ Failed to delete: ${data.message}`);
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      alert("Error deleting file!");
    }
  };

  // ✅ Modal handlers
  const openAddLinkModal = () => {
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkCategory("");
    setShowAddLinkModal(true);
  };

  const closeAddLinkModal = () => {
    setShowAddLinkModal(false);
  };

  const addLink = () => {
    if (!newLinkTitle || !newLinkUrl) return;

    const newLink: LinkItem = {
      id: Date.now(),
      title: newLinkTitle,
      url: newLinkUrl,
      category: newLinkCategory || "General",
    };

    setLinks([...links, newLink]);
    closeAddLinkModal();
  };

  // ✅ Render UI
  return (
    <Layout>
      <h2 className="text-display-md font-display text-gradient-primary mb-6 text-glow">
        Files & Links
      </h2>

      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        This section is your team's shared repository. Upload important
        documents, presentations, and snapshots. You can also save and share
        web links, ensuring everyone has access to the same resources.
      </p>

      {/* ✅ File Upload Section */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading-lg font-heading">Uploaded Files</h3>
          <button onClick={triggerFileSelect} className="btn-primary text-sm">
            Upload File
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* ✅ File grid with delete button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="glass rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 relative"
            >
              <button
                onClick={() => handleDeleteFile(file.name)}
                className="absolute top-2 right-2 text-red-400 hover:text-red-600 text-sm"
                title="Delete file"
              >
                ✖
              </button>

              <a
                href={`${API_BASE}/files/file/${file.name}`}
                download
                className="block"
              >
                <span className="text-4xl">{file.icon}</span>
                <p className="text-body-sm font-body mt-2 truncate text-blue-400 hover:underline">
                  {file.name}
                </p>
              </a>
            </div>
          ))}
        </div>

        {/* ✅ Show recently uploaded file */}
        {uploadedFile && (
          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-400 mb-2">Latest uploaded file:</p>
            <a
              href={`${API_BASE}/files/file/${uploadedFile}`}
              download
              className="text-blue-400 underline"
            >
              Download {uploadedFile}
            </a>
          </div>
        )}
      </div>

      {/* ✅ Links Section */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading-lg font-heading">Saved Important Links</h3>
          <button onClick={openAddLinkModal} className="btn-primary text-sm">
            Add Link
          </button>
        </div>

        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="glass rounded-xl flex items-center justify-between p-3 transition-all duration-300 hover:scale-[1.02]"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gradient-primary hover:underline truncate"
              >
                {link.title}
              </a>
              <span className="text-caption text-zinc-500">{link.category}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Add Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="card w-full max-w-md">
            <h2 className="text-heading-xl font-heading mb-6">Add New Link</h2>
            <div>
              <div className="mb-4">
                <label className="label-enhanced">Link Title</label>
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="input-enhanced w-full placeholder-enhanced"
                  placeholder="e.g., API Documentation"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="label-enhanced">URL</label>
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="input-enhanced w-full placeholder-enhanced"
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="label-enhanced">Category</label>
                <input
                  type="text"
                  value={newLinkCategory}
                  onChange={(e) => setNewLinkCategory(e.target.value)}
                  className="input-enhanced w-full placeholder-enhanced"
                  placeholder="e.g., Design, Backend, Reference"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeAddLinkModal}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addLink}
                  className="w-full btn-primary"
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
