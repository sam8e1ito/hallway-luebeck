import { useState, useEffect } from "react";
import Posts from "../components/Posts";
import { db } from "../firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export default function Home() {
    const [topProfiles, setTopProfiles] = useState([]);

    useEffect(() => {
        // Fetch top profiles by likes
        async function fetchTopProfiles() {
            const q = query(
                collection(db, "users"),
                orderBy("likes", "desc"),
                limit(5)
            );
            const snap = await getDocs(q);
            const profiles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setTopProfiles(profiles);
        }

        fetchTopProfiles();
    }, []);

    return (
        <div className="home-page">
            <section className="top-posts">
                <h2>Recent Posts</h2>
                <Posts />
            </section>

            <aside className="leaderboard">
                <h2>🏆 Top Profiles</h2>
                <div className="profiles-list">
                    {topProfiles.map((user, idx) => (
                        <div key={user.id} className="profile-entry">
                            <span className="rank">#{idx + 1}</span>
                            {user.photoURL && (
                                <img
                                    src={user.photoURL}
                                    alt="pfp"
                                    className="profile-mini-img"
                                />
                            )}
                            <div className="profile-entry-info">
                                <p className="username">
                                    {user.username || "Anonymous"}
                                </p>
                                <p className="likes-count">
                                    ❤️ {user.likes || 0}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}
