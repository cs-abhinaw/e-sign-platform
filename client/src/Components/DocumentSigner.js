
// src/components/DocumentSigner.jsx
import React, { useEffect } from 'react';
import DocumentOpener from './DocumentOpener';
import DocumentAnnotator from './DocumentAnnotator';

const DocumentSigner = ({ selectedFile, saveDocument, loading, setActiveTab }) => {
  useEffect(() => {
    if (selectedFile) {
      // Trigger file processing in DocumentOpener
      // This will be handled by DocumentOpener's handleFileUpload
    }
  }, [selectedFile]);

  return (
    <DocumentOpener selectedFile={selectedFile}>
      {({ canvasRef, document, setDocument }) => (
        <DocumentAnnotator
          canvasRef={canvasRef}
          document={document}
          setDocument={setDocument}
          saveDocument={saveDocument}
          loading={loading}
          setActiveTab={setActiveTab}
        />
      )}
    </DocumentOpener>
  );
};

export default DocumentSigner;