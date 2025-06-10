import React, { useEffect, useState } from 'react';
import { NavLink } from "react-router-dom";
import axios from "axios";

const Headers = () => {
    const [userdata, setUserdata] = useState({});
    console.log("response", userdata);

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:6005/login/sucess", { withCredentials: true });
            setUserdata(response.data.user);
        } catch (error) {
            console.log("error", error);
        }
    };

    const logout = () => {
        window.open("http://localhost:6005/logout", "_self");
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <header style={{
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '0 30px',
            height:"100px"
        }}>
            <nav style={{
                // maxWidth: '1200px',
                height:"70px",
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 0',
                backgroundColor:""
            }}>
                <div className="left" style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1a73e8',
                    letterSpacing: '1px'
                }}>
                    <h1>e-Sign</h1>
                </div>
                <div className="right">
                    <ul style={{
                        display: 'flex',
                        alignItems: 'center',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                        gap: '20px'
                    }}>
                        <li>
                            <NavLink 
                                to="/" 
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    color: isActive ? '#1a73e8' : '#333',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    transition: 'all 0.3s ease'
                                })}
                            >
                                <h2>Home</h2>
                            </NavLink>
                        </li>
                        {Object.keys(userdata).length > 0 ? (
                            <>
                                <li style={{
                                    color: '#333',
                                    fontWeight: 'bold',
                                    padding: '8px 12px'
                                }}>
                                    {userdata?.displayName}
                                </li>
                                <li>
                                    <NavLink 
                                        to="/dashboard"
                                        style={({ isActive }) => ({
                                            textDecoration: 'none',
                                            color: isActive ? '#1a73e8' : '#333',
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            padding: '8px 12px',
                                            borderRadius: '4px',
                                            transition: 'all 0.3s ease'
                                        })}
                                    >
                                        <h2>Dashboard</h2>
                                    </NavLink>
                                </li>
                                <li 
                                    onClick={logout}
                                    style={{
                                        cursor: 'pointer',
                                        color: '#333',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        transition: 'all 0.3s ease',
                                        ':hover': {
                                            backgroundColor: '#f8f9fa',
                                            color: '#dc3545'
                                        }
                                    }}
                                >
                                    <h2>Logout</h2>
                                </li>
                                <li>
                                    <img 
                                        src={userdata?.image} 
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '2px solid #1a73e8'
                                        }} 
                                        alt="User profile"
                                    />
                                </li>
                            </>
                        ) : (
                            <li>
                                <NavLink 
                                    to="/login"
                                    style={({ isActive }) => ({
                                        textDecoration: 'none',
                                        color: isActive ? '#1a73e8' : '#333',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        padding: '8px 12px',
                                        borderRadius: '4px',
                                        backgroundColor: '#1a73e8',
                                        color: '#fff',
                                        transition: 'all 0.3s ease',
                                        ':hover': {
                                            backgroundColor: '#1557b0'
                                        }
                                    })}
                                >
                                    Login
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Headers;