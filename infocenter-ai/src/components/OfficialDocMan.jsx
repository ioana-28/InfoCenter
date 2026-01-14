import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { Upload, FileText, Trash2, Loader2, ExternalLink } from "lucide-react";
import { uploadOfficialDocument, listOfficialDocuments } from "../services/driveService";
import "../css/OfficialDocMan.css";

export default function OfficialDocMan() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    file: null,
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    const data = await listOfficialDocuments();
    // Assuming data is an array of DriveFileResponse objects
    setDocuments(data || []);
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : null,
    });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!form.file) return;

    setUploading(true);
    try {
      await uploadOfficialDocument(form.file);
      await loadDocuments(); // Refresh list
      setForm({ file: null });
      alert("File uploaded successfully!");
    } catch (error) {
      alert("Failed to upload file. Check console for details.");
    } finally {
      setUploading(false);
    }
  };

  // Delete not implemented in backend controller provided
  const handleDelete = (id) => {
    alert("Delete functionality is not currently supported by the server.");
  };

  return (
    <AdminLayout title="Official Documents">
      <div className="docman-page">

        {/* Upload Form */}
        <div className="docman-card">
          <h2 className="section-title">
            <Upload size={18} /> Upload New Document
          </h2>

          <form className="docman-form" onSubmit={handleUpload}>
            <div className="file-input-container">
                <input
                type="file"
                name="file"
                // accept="application/pdf" // Removed restriction to allow any official doc type
                onChange={handleChange}
                required
                />
            </div>

            <button type="submit" className="upload-btn" disabled={uploading}>
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
              {uploading ? "Uploading..." : "Upload Document"}
            </button>
          </form>
        </div>

        {/* Documents List */}
        <div className="docman-card">
          <h2 className="section-title">
            <FileText size={18} /> Uploaded Documents
          </h2>

            {loading ? (
                <div className="loading-state"><Loader2 className="animate-spin" /> Loading documents...</div>
            ) : documents.length === 0 ? (
                <p>No official documents found.</p>
            ) : (
                <div className="doc-list">
                    {documents.map((doc) => (
                    <div key={doc.id} className="doc-item">
                        <div className="doc-info">
                        <h3>{doc.name}</h3>
                        {/* Description is not supported by current backend upload */}
                        {/* <p>{doc.mimeType}</p> */}
                        {doc.webViewLink && (
                             <a href={doc.webViewLink} target="_blank" rel="noopener noreferrer" className="view-link">
                                <ExternalLink size={14} /> View in Drive
                             </a>
                        )}
                        </div>

                        {/* 
                        <button
                        className="delete-btn"
                        onClick={() => handleDelete(doc.id)}
                        title="Delete (Not Implemented)"
                        >
                        <Trash2 size={16} />
                        </button> 
                        */}
                    </div>
                    ))}
                </div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}
