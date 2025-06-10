// components/OverviewTab.jsx
import React from 'react';
import { FileText, Edit3, Mail } from 'lucide-react';

const OverviewTab = ({ user, documents }) => {
  return (
    <div style={{
      background: "#fff", borderRadius: 10, padding: "2rem", boxShadow: "0 1px 3px #0001"
    }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1e293b", marginBottom: 32 }}>
        Welcome back, {user.displayName}!
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <div style={{
          background: '#dbeafe', borderRadius: 8, padding: 22, display: "flex", gap: 16, alignItems: "center"
        }}>
          <FileText size={32} color="#3b82f6" />
          <div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Total Documents</p>
            <p style={{ fontSize: 32, fontWeight: "bold", color: '#1e293b', margin: 0 }}>
              {documents.length}
            </p>
          </div>
        </div>
        <div style={{
          background: '#dcfce7', borderRadius: 8, padding: 22, display: "flex", gap: 16, alignItems: "center"
        }}>
          <Edit3 size={32} color="#22c55e" />
          <div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Signed Documents</p>
            <p style={{ fontSize: 32, fontWeight: "bold", color: '#1e293b', margin: 0 }}>
              {documents.filter(doc => doc.signatures?.length > 0).length}
            </p>
          </div>
        </div>
        <div style={{
          background: '#f3e8ff', borderRadius: 8, padding: 22, display: "flex", gap: 16, alignItems: "center"
        }}>
          <Mail size={32} color="#a855f7" />
          <div>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Sent Documents</p>
            <p style={{ fontSize: 32, fontWeight: "bold", color: '#1e293b', margin: 0 }}>0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;