

// src/components/DocumentOpener.jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, FileText } from 'lucide-react';

const DocumentOpener = ({ children, selectedFile }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [document, setDocument] = useState(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 2;
      redrawCanvas();
    }
  }, [document]);

  // File upload handler
  const handleFileUpload = useCallback((file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const maxWidth = 800;
        const maxHeight = 600;
        
        let { width, height } = img;
        
        // Scale image to fit canvas
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        canvas.width = Math.max(width, maxWidth);
        canvas.height = Math.max(height, maxHeight);
        
        setDocument({
          type: file.type.startsWith('image/') ? 'image' : 'pdf',
          data: e.target.result,
          width,
          height,
          x: (canvas.width - width) / 2,
          y: (canvas.height - height) / 2
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle selectedFile prop
  useEffect(() => {
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  }, [selectedFile, handleFileUpload]);

  // Canvas drawing function
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw document
    if (document) {
      if (document.type === 'image') {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, document.x, document.y, document.width, document.height);
        };
        img.src = document.data;
      } else {
        // PDF placeholder
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(document.x, document.y, document.width, document.height);
        ctx.strokeStyle = '#dee2e6';
        ctx.lineWidth = 2;
        ctx.strokeRect(document.x, document.y, document.width, document.height);
        
        ctx.fillStyle = '#6c757d';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('PDF Document', document.x + document.width/2, document.y + document.height/2 - 20);
        ctx.font = '16px Arial';
        ctx.fillText('(Preview not available)', document.x + document.width/2, document.y + document.height/2 + 10);
      }
    }
  }, [document]);

  const buttonStyle = {
    padding: '10px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: '#f8fafc',
    color: '#374151'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={28} />
            Document Signer
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={buttonStyle}
            >
              <Upload size={16} />
              Upload Document
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div style={{ 
          position: 'relative', 
          border: '2px solid #e2e8f0', 
          borderRadius: '8px', 
          overflow: 'hidden',
          backgroundColor: '#f8f9fa'
        }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            style={{ display: 'block' }}
          />
          {!document && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: '#6b7280',
              pointerEvents: 'none'
            }}>
              <Upload size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
              <p style={{ fontSize: '18px', margin: 0, marginBottom: '8px' }}>Upload a document to start signing</p>
              <p style={{ fontSize: '14px', margin: 0, opacity: 0.7 }}>Supports images and PDF files</p>
            </div>
          )}
        </div>

        {/* Pass canvasRef and document to children */}
        {children({ canvasRef, document, setDocument })}
      </div>
    </div>
  );
};

export default DocumentOpener;