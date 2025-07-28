import { useState } from "react";
import Layout from "../components/Layout";

interface FileItem {
  id: number;
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
  const [files, setFiles] = useState<FileItem[]>([
    { id: 1, name: "Project_Brief.pdf", type: "document", icon: "📄" },
    { id: 2, name: "Whiteboard_Flow.png", type: "image", icon: "🖼️" },
    { id: 3, name: "Final_Pitch.pptx", type: "presentation", icon: "📊" },
  ]);

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

  const handleFileUpload = () => {
    // In a real app, this would trigger a file input and upload process
    alert("File upload functionality would be implemented here.");
  };

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

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-6">Files & Links</h2>
      <p className="text-slate-400 mb-6 max-w-3xl">
        This section is your team's shared repository. Upload important
        documents, presentations, and whiteboard snapshots. You can also save
        and share crucial web links, ensuring everyone has access to the same
        resources.
      </p>
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Uploaded Files</h3>
          <button
            onClick={handleFileUpload}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Upload File
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="p-3 bg-slate-900 rounded-lg text-center"
            >
              <span className="text-4xl">{file.icon}</span>
              <p className="text-sm mt-2 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Saved Important Links</h3>
          <button
            onClick={openAddLinkModal}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            Add Link
          </button>
        </div>
        <ul className="space-y-2">
          {links.map((link) => (
            <li
              key={link.id}
              className="flex items-center justify-between p-3 bg-slate-900 rounded-lg"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:underline truncate"
              >
                {link.title}
              </a>
              <span className="text-xs text-slate-500">{link.category}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="card w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Add New Link</h2>
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-400">
                  Link Title
                </label>
                <input
                  type="text"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g., API Documentation"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-slate-400">
                  URL
                </label>
                <input
                  type="url"
                  value={newLinkUrl}
                  onChange={(e) => setNewLinkUrl(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="https://..."
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1 text-slate-400">
                  Category
                </label>
                <input
                  type="text"
                  value={newLinkCategory}
                  onChange={(e) => setNewLinkCategory(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="e.g., Design, Backend, Reference"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={closeAddLinkModal}
                  className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addLink}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
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
