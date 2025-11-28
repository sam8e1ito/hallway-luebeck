import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmail } from "../firebase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.code === "auth/user-not-found"
                    ? "User not found. Please register first."
                    : err.code === "auth/wrong-password"
                    ? "Incorrect password."
                    : err.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>✨ Hallway Lübeck</h1>
                <p>Sign in to continue</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                {error && <div className="error">{error}</div>}
                <p className="auth-footer">
                    Don't have an account?{" "}
                    <Link to="/register">Create one</Link>
                </p>
            </form>
        </div>
    );
}
