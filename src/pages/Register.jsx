import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUpWithEmail, createUserProfile } from "../firebase";
import { useAuth } from "../hooks/authContext";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    // Auto-redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (username.length < 3) {
            setError("Username must be at least 3 characters");
            return;
        }

        setLoading(true);
        try {
            const cred = await signUpWithEmail(email, password);
            const uid = cred.user.uid;
            // Auto-generate avatar using DiceBear identicon
            const photoURL = `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
                username || uid
            )}`;

            // Create profile and wait for it to complete
            await createUserProfile(uid, {
                username,
                displayName: username,
                photoURL,
            });

            // Small delay to allow Firebase Auth state to update
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Navigate will happen automatically via useEffect watching user state
            // But we can also navigate here to be sure
            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.code === "auth/email-already-in-use"
                    ? "Email already registered"
                    : err.code === "auth/weak-password"
                    ? "Password must be at least 6 characters"
                    : err.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-header">
                <h1>✨ Hallway Lübeck</h1>
                <p>Create your account</p>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={loading}
                />
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
                <input
                    placeholder="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                </button>
                {error && <div className="error">{error}</div>}
                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </form>
        </div>
    );
}
