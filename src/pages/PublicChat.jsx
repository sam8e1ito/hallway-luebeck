import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
    limit,
} from "firebase/firestore";
import { useAuth } from "../hooks/authContext";

export default function PublicChat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const { profile, user } = useAuth();

    useEffect(() => {
        const q = query(
            collection(db, "chat_public"),
            orderBy("createdAt", "desc"),
            limit(50)
        );
        const unsub = onSnapshot(q, (snap) => {
            const msgs = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .reverse();
            setMessages(msgs);
        });
        return () => unsub();
    }, []);

    async function handleSend(e) {
        e.preventDefault();
        if (!text.trim() || !user || !profile) return;
        try {
            await addDoc(collection(db, "chat_public"), {
                userId: user.uid,
                username: profile.username || "Anonymous",
                text: text.trim(),
                createdAt: serverTimestamp(),
            });
            setText("");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="chat-page">
            <h1>Public Chat Room</h1>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">
                        <strong>{msg.username}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <form onSubmit={handleSend} className="chat-form">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
}
