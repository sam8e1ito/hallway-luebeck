import { useState } from "react";
import { useAuth } from "../hooks/authContext";
import {
    createUserProfile,
    signOutUser,
    updateUsernameUnique,
} from "../firebase";

export default function Profile() {
    const { user, profile, setProfile } = useAuth();
    const [username, setUsername] = useState(profile?.username || "");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSave(e) {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setSuccess(false);
        try {
            // Auto-generate avatar based on username (no uploads required)
            const photoURL =
                profile?.photoURL ||
                `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(
                    username || user.uid
                )}`;

            const desiredUsername = username || profile?.username || null;

            // If username changed, attempt atomic update/reservation
            if (desiredUsername && desiredUsername !== profile?.username) {
                try {
                    await updateUsernameUnique(
                        user.uid,
                        desiredUsername,
                        profile?.username
                    );
                } catch (e) {
                    if (e.message === "USERNAME_TAKEN") {
                        alert(
                            "Username already taken — please choose another."
                        );
                        setLoading(false);
                        return;
                    }
                    throw e;
                }
            }

            // Update profile fields (merge)
            await createUserProfile(user.uid, {
                username: desiredUsername,
                displayName: desiredUsername,
                photoURL,
            });

            setProfile({
                ...(profile || {}),
                username: desiredUsername,
                photoURL,
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    }

    async function handleSignOut() {
        await signOutUser();
    }

    if (!user)
        return (
            <div className="loading">Please log in to edit your profile.</div>
        );

    return (
        <div className="profile-page">
            <h1>👤 Your Profile</h1>
            <div className="profile-item">
                {profile?.photoURL ? (
                    <img
                        src={profile.photoURL}
                        alt="pfp"
                        className="profile-pfp"
                    />
                ) : (
                    <div className="profile-pfp-placeholder">📷</div>
                )}
            </div>
            <div className="profile-stats">
                <div className="stat-box">
                    <p className="stat-label">Username</p>
                    <p className="stat-value">
                        {profile?.username || "Not set"}
                    </p>
                </div>
                <div className="stat-box">
                    <p className="stat-label">Email</p>
                    <p className="stat-value">{user?.email || "N/A"}</p>
                </div>
                <div className="stat-box">
                    <p className="stat-label">Total Likes</p>
                    <p className="stat-value">❤️ {profile?.likes || 0}</p>
                </div>
            </div>
            <form onSubmit={handleSave}>
                <input
                    value={username || profile?.username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Update username"
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
                {success && (
                    <div className="success">
                        ✓ Profile updated successfully
                    </div>
                )}
            </form>
            <button onClick={handleSignOut} className="btn-logout">
                Sign Out
            </button>
        </div>
    );
}
