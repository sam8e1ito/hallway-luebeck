import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    getDocs,
    where,
} from "firebase/firestore";
import { useAuth } from "../hooks/authContext";
import { ratePost, addComment, reportPost } from "../firebase";
import { filterContent } from "../utils/contentFilter";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [expandedPost, setExpandedPost] = useState(null);
    const [commentText, setCommentText] = useState({});
    const [comments, setComments] = useState({});
    const [userRatings, setUserRatings] = useState({});
    const [filterError, setFilterError] = useState(null);
    const { user, profile } = useAuth();

    // Load posts
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsub = onSnapshot(q, (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setPosts(arr);
        });
        return () => unsub();
    }, []);

    // Load user's daily ratings
    useEffect(() => {
        if (!user) return;
        const today = new Date().toISOString().split("T")[0];
        posts.forEach(async (post) => {
            const q = query(
                collection(db, "posts", post.id, "ratings"),
                where("userId", "==", user.uid),
                where("date", "==", today)
            );
            const snap = await getDocs(q);
            if (snap.size > 0) {
                setUserRatings((prev) => ({
                    ...prev,
                    [post.id]: true,
                }));
            }
        });
    }, [user, posts]);

    // Load comments for expanded post
    useEffect(() => {
        if (!expandedPost) return;
        const q = query(
            collection(db, "posts", expandedPost, "comments"),
            orderBy("createdAt", "desc")
        );
        const unsub = onSnapshot(q, (snap) => {
            const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
            setComments((prev) => ({ ...prev, [expandedPost]: arr }));
        });
        return () => unsub();
    }, [expandedPost]);

    async function handleCreate(e) {
        e.preventDefault();
        if (!user) return alert("Please login to post");
        if (!text.trim()) return;
        setFilterError(null);

        // Check content for blocked words
        const filterResult = filterContent(text);
        if (!filterResult.isClean) {
            setFilterError(filterResult.reason);
            return;
        }

        try {
            await addDoc(collection(db, "posts"), {
                authorId: user.uid,
                authorUsername: isAnonymous
                    ? "Anonymous"
                    : profile?.username || "Anonymous",
                isAnonymous: isAnonymous,
                text: text.trim(),
                createdAt: serverTimestamp(),
                likes: 0,
                reports: 0,
            });
            setText("");
            setIsAnonymous(false);
            setFilterError(null);
        } catch (err) {
            console.error(err);
            setFilterError("Failed to post. Please try again.");
        }
    }

    async function handleRate(postId, value) {
        if (!user) return alert("Please login");
        if (userRatings[postId])
            return alert("You already rated this post today");
        try {
            const result = await ratePost({ postId, userId: user.uid, value });
            if (result.success) {
                setUserRatings((prev) => ({ ...prev, [postId]: true }));
                setPosts((prev) =>
                    prev.map((p) =>
                        p.id === postId
                            ? { ...p, likes: (p.likes || 0) + value }
                            : p
                    )
                );
            }
        } catch (err) {
            console.error(err);
            alert("Failed to rate");
        }
    }

    async function handleAddComment(postId) {
        if (!user) return alert("Please login");
        const text = commentText[postId]?.trim();
        if (!text) return;

        // Check comment for blocked words
        const filterResult = filterContent(text);
        if (!filterResult.isClean) {
            alert(filterResult.reason);
            return;
        }

        try {
            await addComment({
                postId,
                authorId: user.uid,
                authorUsername:
                    profile?.username || profile?.displayName || "Anonymous",
                text,
            });
            setCommentText((prev) => ({ ...prev, [postId]: "" }));
        } catch (err) {
            console.error(err);
        }
    }

    async function handleReport(postId) {
        if (!user) return alert("Please login");
        const reason = prompt("Why are you reporting this post?");
        if (!reason) return;
        try {
            await reportPost({ postId, reportedBy: user.uid, reason });
            alert("Post reported");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="posts">
            <form onSubmit={handleCreate}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What's up?"
                />
                <div className="post-form-controls">
                    <label className="anonymous-checkbox">
                        <input
                            type="checkbox"
                            checked={isAnonymous}
                            onChange={(e) => setIsAnonymous(e.target.checked)}
                        />
                        <span>Post anonymously</span>
                    </label>
                    <button type="submit">Post</button>
                </div>
                {filterError && <div className="error">{filterError}</div>}
            </form>

            <div className="posts-list">
                {posts.map((p) => (
                    <div key={p.id} className="post">
                        <div className="post-header">
                            <strong>{p.authorUsername || "Anonymous"}</strong>
                            {p.isAnonymous && (
                                <span className="anonymous-badge">
                                    🔒 Anonymous
                                </span>
                            )}
                        </div>
                        <div className="post-text">{p.text}</div>
                        <div className="post-meta">
                            <button
                                onClick={() => handleRate(p.id, 1)}
                                disabled={userRatings[p.id]}
                                className="btn-rate"
                            >
                                👍 Like
                            </button>
                            <button
                                onClick={() => handleRate(p.id, -1)}
                                disabled={userRatings[p.id]}
                                className="btn-rate"
                            >
                                👎 Dislike
                            </button>
                            <button
                                onClick={() => handleReport(p.id)}
                                className="btn-report"
                            >
                                🚩 Report
                            </button>
                            <button
                                onClick={() =>
                                    setExpandedPost(
                                        expandedPost === p.id ? null : p.id
                                    )
                                }
                                className="btn-comments"
                            >
                                💬 Comments
                            </button>
                            <span className="likes-count">
                                Likes: {p.likes || 0}
                            </span>
                        </div>

                        {expandedPost === p.id && (
                            <div className="post-comments">
                                <div className="comments-list">
                                    {(comments[p.id] || []).map((c) => (
                                        <div key={c.id} className="comment">
                                            <strong>
                                                {c.authorUsername || "User"}:
                                            </strong>{" "}
                                            {c.text}
                                        </div>
                                    ))}
                                </div>
                                <div className="comment-form">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentText[p.id] || ""}
                                        onChange={(e) =>
                                            setCommentText((prev) => ({
                                                ...prev,
                                                [p.id]: e.target.value,
                                            }))
                                        }
                                    />
                                    <button
                                        onClick={() => handleAddComment(p.id)}
                                    >
                                        Post
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
