import React from "react";
import "./login.css";

const Login = () => {
  const loginwithgoogle = () => {
    window.open("http://localhost:6005/auth/google/callback", "_self");
  };
  return (
    <>
      <div style={{ margin: "120px" }}>
        <div
          className="login-page"
          style={{ textAlign: "center", backgroundColor: "blueviolet" }}
        >
          <div className="form">
            <h1 style={{ textAlign: "center" }}>Login</h1>

            <button className="login-with-google-btn" onClick={loginwithgoogle}>
              Continue With Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
