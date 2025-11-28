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

function generateAnonName() {
    const adjectives = ["Happy", "Clever", "Swift", "Bright", "Quiet"];
    const animals = ["Panda", "Eagle", "Tiger", "Fox", "Wolf"];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${
        animals[Math.floor(Math.random() * animals.length)]
    }`;
}

export default function AnonChat() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [anonName] = useState(() => generateAnonName());
    const { user } = useAuth();

    useEffect(() => {
        const q = query(
            collection(db, "chat_anon"),
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
        if (!text.trim() || !user) return;
        try {
            await addDoc(collection(db, "chat_anon"), {
                userId: user.uid,
                anonName,
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
            <h1>Anonymous Chat Room</h1>
            <p>
                Your anonymous name: <strong>{anonName}</strong>
            </p>
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className="message">
                        <strong>{msg.anonName || "Anonymous"}:</strong>{" "}
                        {msg.text}
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
