// components/UploadTab.jsx
import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const UploadTab = ({ processFile, setTextContent, textContent, setActiveTab, selectedFile }) => {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "2rem", boxShadow: "0 1px 3px #0001"
    }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b", marginBottom: 32 }}>
        Upload Document
      </h2>
      <div
        style={{
          border: `2px dashed ${dragOver ? '#3b82f6' : '#d1d5db'}`,
          borderRadius: '0.5rem',
          padding: '3rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: dragOver ? '#f0f9ff' : '#f9fafb',
          marginBottom: '2rem'
        }}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={e => { e.preventDefault(); setDragOver(false); }}
        onDrop={e => {
          e.preventDefault(); setDragOver(false);
          const files = e.dataTransfer.files;
          if (files.length > 0) processFile(files[0]);
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <Upload size={48} color="#6b7280" style={{ marginBottom: 16 }} />
        <p style={{ fontSize: 18, fontWeight: 500, color: '#374151', margin: 0 }}>
          {dragOver ? 'Drop your file here' : 'Drag & Drop or Click to Upload'}
        </p>
        <input
          id="file-upload"
          type="file"
          style={{ display: "none" }}
          accept=".pdf,.png,.jpg,.jpeg,.gif,.txt,.doc,.docx"
          onChange={e => processFile(e.target.files[0])}
        />
        <p style={{ fontSize: 14, color: "#6b7280", margin: "6px 0 0 0" }}>
          PDF, PNG, JPG, GIF, TXT, DOC up to 10MB
        </p>
      </div>
      <div>
        <label style={{ fontWeight: 500, color: "#374151", marginBottom: 8 }}>Or Create Text Document</label>
        <textarea
          value={textContent}
          onChange={e => setTextContent(e.target.value)}
          style={{
            width: "100%", minHeight: 150, padding: 12,
            border: "1px solid #d1d5db", borderRadius: 6, fontSize: 15, resize: "vertical", marginTop: 6
          }}
          placeholder="Type your document content here..."
        />
      </div>
      {(selectedFile || textContent) && (
        <button
          onClick={() => setActiveTab('sign')}
          style={{
            width: "100%", marginTop: 32, padding: 12, background: "#3b82f6", color: "#fff",
            border: "none", borderRadius: 6, fontSize: 18, fontWeight: 500, cursor: "pointer"
          }}
        >
          Proceed to Edit & Sign Document
        </button>
      )}
    </div>
  );
};

export default UploadTab;