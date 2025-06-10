// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Head from './Head';
import Nav from './Nav';
import OverviewTab from './OverviewTab';
import UploadTab from './UploadTab';
import DocumentSigner from './DocumentSigner';
import DocumentsTab from './DocumentsTab';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [textContent, setTextContent] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Authentication & Fetching User Docs
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get("http://localhost:6005/login/sucess", {
          withCredentials: true
        });
        if (response.status === 200 && response.data.user) {
          setUser(response.data.user);
          fetchUserDocuments(response.data.user._id);
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };
    getUser();
  }, [navigate]);

  const fetchUserDocuments = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:6005/api/documents/${userId}`, {
        withCredentials: true
      });
      setDocuments(response.data.documents || []);
    } catch (error) {
      // Handle error silently
    }
  };

  // File Processing
  const processFile = (file) => {
    if (file) {
      setSelectedFile(file);
      setActiveTab('sign');
    }
  };

  // Save Document
  const saveDocument = async (documentData) => {
    if (!documentData.content && !documentData.textElements.length && !documentData.signatures.length) {
      alert('Please add some content before saving');
      return;
    }
    setLoading(true);
    try {
      const newDocument = {
        id: Date.now(),
        userId: user._id,
        fileName: selectedFile ? selectedFile.name : `Document_${Date.now()}.png`,
        fileType: selectedFile ? selectedFile.type : 'image/png',
        content: documentData.content,
        textElements: documentData.textElements,
        signatures: documentData.signatures,
        createdAt: new Date().toISOString()
      };
      const response = await axios.post('http://localhost:6005/api/documents/save', newDocument, { withCredentials: true });
      if (response.status === 200) {
        setDocuments([...documents, newDocument]);
        alert('Document saved!');
        setActiveTab('documents');
        setSelectedFile(null);
        setTextContent('');
      }
    } catch (err) {
      alert("Failed to save document.");
    } finally {
      setLoading(false);
    }
  };

  const sendDocumentByEmail = async (document) => {
    if (!recipientEmail) {
      alert('Please enter recipient email address');
      return;
    }
    setLoading(true);
    try {
      const emailData = {
        recipientEmail,
        document: {
          fileName: document.fileName,
          content: document.content,
          fileType: document.fileType
        },
        senderName: user.displayName,
        senderEmail: user.email
      };
      const response = await axios.post('http://localhost:6005/api/documents/send-email', emailData, {
        withCredentials: true
      });
      if (response.status === 200) {
        alert(`Document "${document.fileName}" sent to ${recipientEmail}`);
        setRecipientEmail('');
      }
    } catch (error) {
      alert('Failed to send document. Please try again.');
    }
    setLoading(false);
  };

  const downloadDocument = (document) => {
    const link = document.createElement('a');
    link.href = document.content;
    link.download = document.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteDocument = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`http://localhost:6005/api/documents/${documentId}`, { withCredentials: true });
      fetchUserDocuments(user._id);
      alert('Document deleted!');
    } catch {
      alert('Failed to delete document.');
    }
  };

  useEffect(() => {
    if (textContent && activeTab === 'sign') {
      // Text content handling moved to DocumentSigner
      setTextContent('');
    }
  }, [textContent, activeTab]);

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Head user={user} />
      <Nav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1rem" }}>
        {activeTab === "overview" && (
          <OverviewTab user={user} documents={documents} />
        )}
        {activeTab === "upload" && (
          <UploadTab
            processFile={processFile}
            setTextContent={setTextContent}
            textContent={textContent}
            setActiveTab={setActiveTab}
            selectedFile={selectedFile}
          />
        )}
        {activeTab === "sign" && (
          <DocumentSigner
            selectedFile={selectedFile}
            saveDocument={saveDocument}
            loading={loading}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            documents={documents}
            sendDocumentByEmail={sendDocumentByEmail}
            downloadDocument={downloadDocument}
            deleteDocument={deleteDocument}
            recipientEmail={recipientEmail}
            setRecipientEmail={setRecipientEmail}
            loading={loading}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
