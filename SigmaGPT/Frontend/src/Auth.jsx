import { useState } from "react";
import "./Auth.css";

function Auth({ onAuthSuccess }) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
            const payload = isLoginMode
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Authentication failed");
            }

            onAuthSuccess(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <form className="authCard" onSubmit={handleSubmit}>
                <h2>{isLoginMode ? "Login" : "Create Account"}</h2>
                {!isLoginMode && (
                    <input
                        name="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                />
                {error && <p className="authError">{error}</p>}
                <button className="authBtn" type="submit" disabled={loading}>
                    {loading ? "Please wait..." : isLoginMode ? "Login" : "Register"}
                </button>
                <p className="authSwitch">
                    {isLoginMode ? "New user?" : "Already have an account?"}{" "}
                    <span onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? "Create one" : "Login"}
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Auth;
