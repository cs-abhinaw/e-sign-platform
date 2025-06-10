import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  return (
    <div style={homeStyles.container}>
      <header style={homeStyles.header}>
        <h1 style={homeStyles.title}>Welcome to eSign App</h1>
        <p style={homeStyles.subtitle}>Your seamless solution for digital task organization and e-signatures.</p>
      </header>

      <main style={homeStyles.mainContent}>
        <p style={homeStyles.description}>
          Streamline your workflow, manage documents, and get things signed with ease.
          Get started now to experience the future of digital efficiency!
        </p>
        <button
          onClick={handleGetStartedClick}
          style={homeStyles.button}
          aria-label="Get started with eSign App"
        >
          Get Started
        </button>
      </main>
    </div>
  );
};

const homeStyles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8f9fa',
    color: '#343a40',
    textAlign: 'center',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: '40px',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '15px',
    color: '#2c3e50',
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
  },
  subtitle: {
    fontSize: '1.5rem',
    color: '#555',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    fontSize: '1.1rem',
    marginBottom: '40px',
    color: '#6c757d',
    maxWidth: '700px',
    lineHeight: '1.7',
  },
  button: {
    padding: '15px 35px',
    fontSize: '1.15rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
    boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)',
  },
};

export default Home;