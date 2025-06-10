// components/Nav.jsx
import React from 'react';

const Nav = ({ activeTab, setActiveTab }) => {
  const tabs = ["overview", "upload", "sign", "documents"];

  return (
    <nav style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "1rem 0"
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 1rem", display: "flex", gap: 36
      }}>
        {tabs.map(tab => (
          <button
            key={tab}
            style={{
              padding: ".5rem 1rem", background: activeTab === tab ? "#3b82f6" : "transparent",
              color: activeTab === tab ? "#fff" : "#64748b", border: "none", borderRadius: 6,
              cursor: "pointer", fontWeight: activeTab === tab ? 600 : 400, textTransform: "capitalize"
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Nav;