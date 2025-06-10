// components/DocumentsTab.jsx
import React from 'react';
import { FileText, Send, Download, Trash2 } from 'lucide-react';

const DocumentsTab = ({ documents, sendDocumentByEmail, downloadDocument, deleteDocument, recipientEmail, setRecipientEmail, loading }) => {
  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "2rem", boxShadow: "0 1px 3px #0001"
    }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b", marginBottom: 32 }}>
        My Documents
      </h2>
      {documents.length === 0 ? (
        <div style={{ textAlign: "center", color: "#64748b", padding: "3rem 0" }}>
          <FileText size={48} color="#a3a3a3" />
          <p>No documents yet. Upload and sign your first document!</p>
        </div>
      ) : (
        <div>
          {documents.map((doc, idx) => (
            <div key={doc.id || idx} style={{
              border: "1px solid #e2e8f0", borderRadius: 8, padding: 18, marginBottom: 18,
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <FileText size={28} color="#94a3b8" />
                <div>
                  <h3 style={{ margin: 0, fontWeight: 600, fontSize: 18 }}>{doc.fileName}</h3>
                  <span style={{ color: "#64748b", fontSize: 13 }}>
                    Created: {new Date(doc.createdAt).toLocaleDateString()}
                    {(doc.signatures?.length > 0 || doc.textElements?.length > 0) && (
                      <span style={{ color: "#10b981", fontWeight: 600, marginLeft: 8 }}>✓ Edited</span>
                    )}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="email"
                  placeholder="Recipient email"
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  style={{
                    border: "1px solid #d1d5db", borderRadius: 4, fontSize: 14, padding: 6,
                    marginRight: 8, minWidth: 180
                  }}
                />
                <button onClick={() => sendDocumentByEmail(doc)} disabled={loading}
                  style={{
                    background: "#6366f1", color: "#fff", border: "none", borderRadius: 4,
                    padding: "5px 12px", fontSize: 14, cursor: loading ? "not-allowed" : "pointer"
                  }}>
                  <Send size={14} style={{ marginRight: 5 }} />Send
                </button>
                <button onClick={() => downloadDocument(doc)}
                  style={{
                    background: "#fb923c", color: "#fff", border: "none", borderRadius: 4, padding: "5px 12px",
                    fontSize: 14, cursor: "pointer"
                  }}>
                  <Download size={14} style={{ marginRight: 5 }} />Download
                </button>
                <button onClick={() => deleteDocument(doc.id)}
                  style={{
                    background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, padding: "5px 12px",
                    fontSize: 14, cursor: "pointer"
                  }}>
                  <Trash2 size={14} style={{ marginRight: 5 }} />Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;