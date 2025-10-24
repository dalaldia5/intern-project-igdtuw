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
      <h2 className="text-display-md font-display text-gradient-primary mb-6 text-glow">
        Files & Links
      </h2>
      <p className="text-body-sm font-body text-zinc-400 mb-6 max-w-3xl">
        This section is your team's shared repository. Upload important
        documents, presentations, and whiteboard snapshots. You can also save
        and share crucial web links, ensuring everyone has access to the same
        resources.
      </p>
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading-lg font-heading">Uploaded Files</h3>
          <button onClick={handleFileUpload} className="btn-primary text-sm">
            Upload File
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => (
            <div
              key={file.id}
              className="glass rounded-xl p-3 text-center transition-all duration-300 hover:scale-105"
            >
              <span className="text-4xl">{file.icon}</span>
              <p className="text-body-sm font-body mt-2 truncate">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-heading-lg font-heading">
            Saved Important Links
          </h3>
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
              <span className="text-caption text-zinc-500">
                {link.category}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Link Modal */}
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
