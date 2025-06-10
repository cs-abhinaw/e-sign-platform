// components/Header.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Head = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await axios.get("http://localhost:6005/logout", { withCredentials: true });
    navigate("/login");
  };

  return (
    <header style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "1.2rem 0"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex",
        justifyContent: "space-between", alignItems: "center"
      }}>
        <h1 style={{ fontSize: 24, fontWeight: "bold", margin: 0 }}>Digital Signature Dashboard</h1>
        
      </div>
    </header>
  );
};

export default Head;