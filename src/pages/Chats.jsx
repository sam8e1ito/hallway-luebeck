import { Link } from "react-router-dom";

export default function Chats() {
    return (
        <div className="chats-page">
            <h1>Chats</h1>
            <p>Choose a chat type:</p>
            <div className="chat-options">
                <Link to="/chats/public" className="chat-card">
                    <h2>Public Chat</h2>
                    <p>Chat with your username visible to everyone</p>
                </Link>
                <Link to="/chats/anon" className="chat-card">
                    <h2>Anonymous Chat</h2>
                    <p>Chat with a randomized anonymous name</p>
                </Link>
            </div>
        </div>
    );
}
