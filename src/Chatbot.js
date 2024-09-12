import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chatbot.css';

// Helper function to generate a random sessionId
const generateSessionId = () => {
    return Math.random().toString(36).substr(2, 9);
};

const Chatbot = () => {
    const [messages, setMessages] = useState([]); // Stores chat history
    const [inputMessage, setInputMessage] = useState(''); // Input from the user
    const [sessionId, setSessionId] = useState(''); // Session ID for the conversation

    // Generate sessionId on component mount (only once)
    useEffect(() => {
        setSessionId(generateSessionId());
    }, []);

    // Handles message input change
    const handleInputChange = (e) => {
        setInputMessage(e.target.value);
    };

    // Sends message to the backend and gets a response
    const sendMessage = async () => {
        if (!inputMessage.trim()) return; // Ignore if empty input

        const userMessage = { role: 'user', content: inputMessage };
        setMessages([...messages, userMessage]); // Add user's message to chat

        try {
            const response = await axios.post('http://localhost:3000/chat', {
                sessionId, // Pass the sessionId with each request
                message: inputMessage,
            });

            const botMessage = { role: 'assistant', content: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot's response to chat
        } catch (error) {
            console.error('Error sending message:', error.response || error.message);
        }

        setInputMessage(''); // Clear input field
    };

    // Handles sending the message when pressing Enter key
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    // Handles "New Chat" button click
    const handleNewChat = () => {
        setSessionId(generateSessionId()); // Generate a new session ID
        setMessages([]); // Clear the chat history
        console.log("New chat session started with sessionId:", sessionId);
    };

    return (
        <div className="chat-container">
            <button className="new-chat-button" onClick={handleNewChat}>
                New Chat
            </button>

            <div className="chat-history">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message ${msg.role === 'user' ? 'user-message' : 'bot-message'}`}
                    >
                        {msg.role === 'assistant' ? (
                            <pre>{msg.content}</pre> // Wrap bot's response in a <pre> tag
                        ) : (
                            msg.content
                        )}
                    </div>
                ))}
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about workouts or diet plans..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chatbot;
