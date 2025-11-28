import { useState } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    getDocs,
    doc,
    updateDoc,
    increment,
} from "firebase/firestore";
import { useAuth } from "../hooks/authContext";

export default function Search() {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const lowerSearch = searchTerm.toLowerCase();
            const q = query(collection(db, "users"));
            const snap = await getDocs(q);
            const users = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .filter(
                    (u) =>
                        u.username &&
                        u.username.toLowerCase().includes(lowerSearch)
                )
                .sort((a, b) => (b.likes || 0) - (a.likes || 0));
            setResults(users);
        } catch (err) {
            console.error(err);
            alert("Search failed");
        }
        setLoading(false);
    }

    async function handleLike(userId) {
        if (!user) return;
        try {
            const ref = doc(db, "users", userId);
            await updateDoc(ref, { likes: increment(1) });
            setResults(
                results.map((u) =>
                    u.id === userId ? { ...u, likes: (u.likes || 0) + 1 } : u
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDislike(userId) {
        if (!user) return;
        try {
            const ref = doc(db, "users", userId);
            await updateDoc(ref, { likes: increment(-1) });
            setResults(
                results.map((u) =>
                    u.id === userId ? { ...u, likes: (u.likes || 0) - 1 } : u
                )
            );
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="search-page">
            <h1>Search Users</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="Search by username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Searching..." : "Search"}
                </button>
            </form>

            <div className="search-results">
                {results.map((user) => (
                    <div key={user.id} className="user-card">
                        {user.photoURL && (
                            <img
                                src={user.photoURL}
                                alt={user.username}
                                className="user-avatar"
                            />
                        )}
                        <div className="user-info">
                            <h3>{user.username || "Anonymous"}</h3>
                            <p>Likes: {user.likes || 0}</p>
                        </div>
                        <div className="user-actions">
                            <button
                                onClick={() => handleLike(user.id)}
                                className="btn-like"
                            >
                                👍 Like
                            </button>
                            <button
                                onClick={() => handleDislike(user.id)}
                                className="btn-dislike"
                            >
                                👎 Dislike
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
