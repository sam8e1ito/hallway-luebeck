import { Link } from "react-router-dom";
import { useAuth } from "../hooks/authContext";
import { signOutUser } from "../firebase";
import { HomeIcon, ChatIcon, SearchIcon, ProfileIcon } from "../assets/icons";
import { useState } from "react";

export default function Navbar() {
    const { profile } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);

    async function handleSignOut() {
        await signOutUser();
        setShowDropdown(false);
    }

    return (
        <nav className="navbar">
            <Link to="/">
                <HomeIcon color="#1C274C" />
                Home
            </Link>
            <Link to="/chats">
                <ChatIcon color="#1C274C" />
                Chats
            </Link>
            <Link to="/search">
                <SearchIcon color="#1C274C" />
                Search
            </Link>
            <Link to="/profile">
                <ProfileIcon color="#1C274C" />
                Profile
            </Link>

            <div className="navbar-profile-menu">
                <button
                    className="pfp-button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    title="Profile Menu"
                >
                    {profile?.photoURL ? (
                        <img
                            src={profile.photoURL}
                            alt="pfp"
                            className="pfp-img"
                        />
                    ) : (
                        <div className="pfp-placeholder">👤</div>
                    )}
                </button>
                {showDropdown && (
                    <div className="dropdown-menu">
                        <button onClick={handleSignOut}>Sign Out</button>
                    </div>
                )}
            </div>
        </nav>
    );
}
