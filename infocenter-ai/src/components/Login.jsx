import {useState} from "react";
import { useEffect } from "react";
import {LogIn, Mail, Lock, ArrowLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";
import "../css/Login.css";

export function Login({onLogin}) {
    const navigate = useNavigate(); // ✅ navigation

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    
    try {
        const response = await fetch("http://localhost:8080/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Invalid email or password";
            try {
                const errorData = await response.json();
                if (errorData.message) errorMessage = errorData.message;
            } catch (e) {
                // If response isn't JSON, keep default
            }

            // Check if it's a "User not found" error (assuming 404 or specific text)
            if (response.status === 404 || errorMessage.toLowerCase().includes("not found")) {
                throw new Error("Account doesn't exist. Please register first.");
            }

            throw new Error(errorMessage);
        }

        const data = await response.json();

        
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", email);


        onLogin(email);
        if (data.role === "ADMIN") {
            navigate("/admin/dashboard");
        } else {
            navigate("/student/chat");
        }


    } catch (err) {
        setError(err.message);
    }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                {/* Logo */}
                <div className="login-logo">
                    <div className="logo-circle">
                        <LogIn className="logo-icon"/>
                    </div>
                    <h2 className="login-title">Welcome Back</h2>
                    <p className="login-subtitle">Sign in to continue</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">

                    {error && <div className="error-box">{error}</div>}

                    <div className="input-group">
                        <Mail className="input-icon"/>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon"/>
                        <input
                            type="password"
                            placeholder="Your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="login-btn" type="submit">
                        <LogIn className="icon-small"/>
                        Login
                    </button>

                    {/* ✅ Register navigation */}
                    <div className="register-text">
                        Don’t have an account?
                        <span
                            onClick={() => navigate("/register")}
                            className="register-link"
                        >
              Register here
            </span>
                    </div>

                </form>

            </div>
        </div>
    );
}

export default Login;