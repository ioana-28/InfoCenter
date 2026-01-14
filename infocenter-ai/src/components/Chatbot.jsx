import {useState, useRef, useEffect} from 'react';
import {Send, LogIn, LogOut, Bot, User, MessageSquare, Plus, Clock, Menu, Trash2, Edit2, FileText, HelpCircle} from 'lucide-react';
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import '../css/Chatbot.css';
import { useNavigate } from 'react-router-dom';
import { getUserConversations, createConversation, getConversationMessages, deleteConversation, sendMessageToAI, renameConversation } from '../services/chatService';

export function Chatbot({ isLoggedIn, userEmail, onLogout, onNavigateToLogin }) {
    
     const navigate = useNavigate();
    // --- State & Refs ---
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    // Default to closed on mobile (width < 768px), open on desktop
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768); 
    const [conversations, setConversations] = useState([]);
    const [currentSessionId, setCurrentSessionId] = useState(null);
    const [isFocused, setIsFocused] = useState(false);
    const messagesEndRef = useRef(null);

    // --- Effects ---
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            loadConversations();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadConversations = async () => {
        const data = await getUserConversations();
        console.log("Loaded conversations:", data);
        setConversations(data);
        // Optionally load the most recent conversation
        if (data.length > 0 && !currentSessionId) {
            // Fallback for different ID field names
            const firstId = data[0].id || data[0].conversationId || data[0].sessionId;
            if (firstId) {
                handleSelectConversation(firstId);
            } else {
                console.error("First conversation has no valid ID:", data[0]);
            }
        } else if (data.length === 0) {
            // Start fresh if no history
            setMessages([{
                id: 'welcome',
                text: 'Welcome! Start a new conversation to begin.',
                sender: 'bot',
                timestamp: new Date()
            }]);
        }
    };

    const handleSelectConversation = async (sessionId) => {
        console.log("Selecting conversation:", sessionId);
        if (!sessionId) return;
        
        setCurrentSessionId(sessionId);
        try {
            const msgs = await getConversationMessages(sessionId);
            console.log("Raw messages:", msgs); // Debug log

            const formattedMsgs = msgs.map(m => {
                // Helper to parse timestamp safely
                let dateObj = new Date();
                // Backend returns 'sentAt', but we keep 'timestamp' as fallback
                const timeValue = m.sentAt || m.timestamp;

                if (timeValue) {
                    // Handle Spring Boot array format [yyyy, mm, dd, hh, mm, ss]
                    if (Array.isArray(timeValue)) {
                        dateObj = new Date(
                            timeValue[0],
                            timeValue[1] - 1, // Month is 0-indexed in JS
                            timeValue[2],
                            timeValue[3] || 0,
                            timeValue[4] || 0,
                            timeValue[5] || 0
                        );
                    } else {
                        const parsed = new Date(timeValue);
                        if (!isNaN(parsed.getTime())) {
                            dateObj = parsed;
                        }
                    }
                }

                const senderRaw = m.sender ? String(m.sender).toUpperCase().trim() : '';
                const isUser = senderRaw === 'USER' || senderRaw === 'STUDENT';
                return {
                    id: m.messageId || m.id,
                    text: m.messageText || m.text,
                    // Check for various user sender types
                    sender: isUser ? 'user' : 'bot',
                    timestamp: dateObj
                };
            });
            setMessages(formattedMsgs);
        } catch (error) {
            console.error("Failed to load messages for conversation:", sessionId, error);
        }
    };

    const handleNewConversation = async () => {
        try {
            const newConv = await createConversation(`Conversation ${new Date().toLocaleDateString()}`);
            console.log("New conversation created:", newConv);
            
            // Check for various ID field names
            const newId = newConv.id || newConv.conversationId || newConv.sessionId;

            if (newConv && newId) {
                // Ensure the object has an 'id' property for the frontend to use consistently
                const convWithId = { ...newConv, id: newId };
                setConversations(prev => [convWithId, ...prev]);
                setCurrentSessionId(newId);
                setMessages([{
                    id: 'welcome',
                    text: 'New conversation started. How can I help?',
                    sender: 'bot',
                    timestamp: new Date()
                }]);
            } else {
                console.error("Created conversation response is missing ID:", newConv);
                // Fallback: try to reload conversations
                loadConversations();
            }
        } catch (error) {
            console.error("Failed to create conversation", error);
        }
    };

    const handleDeleteConversation = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this conversation?")) return;
        try {
            await deleteConversation(id);
            setConversations(conversations.filter(c => c.id !== id));
            if (currentSessionId === id) {
                setCurrentSessionId(null);
                setMessages([]);
            }
        } catch (error) {
            console.error("Failed to delete conversation", error);
        }
    };

    const handleRenameConversation = async (e, id, currentTitle) => {
        e.stopPropagation();
        const newTitle = window.prompt("Enter new conversation title:", currentTitle);
        if (!newTitle || newTitle.trim() === currentTitle) return;

        try {
            const updatedConv = await renameConversation(id, newTitle.trim());
            setConversations(conversations.map(c => 
                c.id === id ? { ...c, title: updatedConv.title || newTitle.trim() } : c
            ));
        } catch (error) {
            console.error("Failed to rename conversation", error);
            alert("Failed to rename conversation");
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    // --- Handlers ---
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        // If no session exists, create one first
        let sessionId = currentSessionId;
        if (!sessionId) {
            try {
                const newConv = await createConversation(`New Chat ${new Date().toLocaleTimeString()}`);
                console.log("Auto-created conversation:", newConv);
                
                const newId = newConv.id || newConv.conversationId || newConv.sessionId;

                if (newConv && newId) {
                    const convWithId = { ...newConv, id: newId };
                    setConversations(prev => [convWithId, ...prev]);
                    sessionId = newId;
                    setCurrentSessionId(sessionId);
                } else {
                    console.error("Failed to get ID from new conversation", newConv);
                    alert("Could not start a new conversation session.");
                    return;
                }
            } catch (error) {
                console.error("Error starting conversation:", error);
                alert("Failed to start new conversation.");
                return;
            }
        }

        const newMessage = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        const currentInput = inputValue;
        setInputValue('');

        try {
            const data = await sendMessageToAI(currentInput, sessionId);
            
            // Check if the response contains a session ID we should update to
            if (data.sessionId && data.sessionId !== sessionId) {
                console.log("Updating session ID from response:", data.sessionId);
                setCurrentSessionId(data.sessionId);
            }

            const botText = data.response || data.output || "I received your message but got no text back.";

            const botReply = {
                id: Date.now().toString(),
                text: botText,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botReply]);

        } catch (error) {
            console.error("Chat error:", error);
            const errorReply = {
                id: Date.now().toString(),
                text: "Sorry, I'm having trouble connecting to the server right now.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorReply]);
        }
    };

    const handleLogout = () => {
        // Remove JWT and email
        localStorage.removeItem("token");
        localStorage.removeItem("email");

        // Optional: reset app state if you have one
        onLogout(); // this can update parent state like isLoggedIn
        navigate("/login"); // redirect to login page
    };


    return (
        <div className="chatbot-layout">
            {/* 1. Header (Fixed Top) */}
            <header className="chatbot-header">
                <div className="header-left">
                    <button
                        className="menu-toggle"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <Menu size={24}/>
                    </button>
                    <div className="logo-area">
                        <Bot className="logo-icon" />
                        <span className="logo-text">UniBot</span>

                        {/* Student Portal Links */}
                        <nav className="student-top-nav">
                            <Link to="/student" className="top-nav-link">Chat</Link>
                            <Link to="/student/request" className="top-nav-link">Requests</Link>
                            <Link to="/student/history" className="top-nav-link">History</Link>
                            <Link to="/student/faq" className="top-nav-link">FAQ</Link>
                            <Link to="/student/profile" className="top-nav-link">Profile</Link>
                        </nav>
                    </div>
                </div>

                <div className="header-right">
                    {isLoggedIn ? (
                        <div className="user-pill">
                            <User size={16}/>
                            <span className="email-text">{userEmail}</span>
                            <button onClick={handleLogout} className="btn-icon-only" title="Logout">
                                <LogOut size={16}/>
                            </button>
                        </div>
                    ) : (
                        <button onClick={onNavigateToLogin} className="btn-auth">
                            Login
                        </button>
                    )}
                </div>
            </header>

            {/* 2. Main Body (Sidebar + Chat) */}
            <div className="main-container">

                {/* Mobile Overlay */}
                <div 
                    className={`chat-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <button className="new-chat-btn" onClick={handleNewConversation}>
                            <Plus size={16}/>
                            <span>New Conversation</span>
                        </button>
                    </div>

                    {/* Mobile Navigation (Visible only on small screens) */}
                    <div className="mobile-nav-menu">
                        <div className="history-label">Menu</div>
                        <Link to="/student/request" className="mobile-nav-item">
                            <FileText size={16}/> <span>Request Docs</span>
                        </Link>
                        <Link to="/student/history" className="mobile-nav-item">
                            <Clock size={16}/> <span>History</span>
                        </Link>
                        <Link to="/student/faq" className="mobile-nav-item">
                            <HelpCircle size={16}/> <span>FAQ</span>
                        </Link>
                        <Link to="/student/profile" className="mobile-nav-item">
                            <User size={16}/> <span>Profile</span>
                        </Link>
                        <div className="mobile-nav-divider"></div>
                    </div>

                    <div className="history-list">
                        <div className="history-label">Recent History</div>
                        {conversations.map((conv) => {
                            const convId = conv.id || conv.sessionId;
                            return (
                                <div 
                                    key={convId} 
                                    className={`history-item ${currentSessionId === convId ? 'active' : ''}`}
                                    onClick={() => handleSelectConversation(convId)}
                                >
                                    <MessageSquare size={16} className="history-icon"/>
                                    <span className="history-title">
                                        {conv.title || (convId ? `Conversation ${String(convId).substring(0, 4)}...` : 'Untitled')}
                                    </span>
                                    <div className="history-actions">
                                        <button 
                                            className="action-conv-btn"
                                            onClick={(e) => handleRenameConversation(e, convId, conv.title)}
                                            title="Rename conversation"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button 
                                            className="action-conv-btn delete-btn"
                                            onClick={(e) => handleDeleteConversation(e, convId)}
                                            title="Delete conversation"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="sidebar-footer">
                        <div className="footer-item">
                            <Clock size={14}/>
                            <span>Support Hours: 8am - 6pm</span>
                        </div>
                    </div>
                </aside>

                {/* Chat Area */}
                <main className="chat-interface">
                    {/* Scrollable Messages Area */}
                    <div className="messages-area">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message-row ${message.sender === 'user' ? 'row-user' : 'row-bot'}`}
                            >
                                <div className="message-bubble">
                                    <div className="bubble-header">
                    <span className="sender-name">
                      {message.sender === 'user' ? 'You' : 'Assistant'}
                    </span>
                                        <span className="time-text">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </span>
                                    </div>
                                    <div className="bubble-text chat-message">
                                        <ReactMarkdown>{message.text}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef}/>
                    </div>

                    {/* Fixed Input Area */}
                    {/* Fixed Input Area */}
                    <div className="input-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        
                        {/* 1. The Container Box (White pill shape) - We force it to be 90% width */}
                        <div 
                            className="input-box" 
                            style={{ 
                                width: '90%', 
                                maxWidth: '1000px',  /* Maximum width on large screens */
                                display: 'flex', 
                                alignItems: 'center',
                                padding: '5px 10px', /* Add padding to look like the design */
                                boxSizing: 'border-box' /* Ensures padding doesn't break width */
                            }}
                        >
                            {/* 2. The Input Field - We force it to grow to fill the container */}
                            <input
                                className="chat-input"
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your question here..."
                                style={{ 
                                    flex: 1,           /* Takes up all available space */
                                    width: '100%',     /* Ensures it fills the flex space */
                                    border: 'none',    /* Remove default border if needed */
                                    outline: 'none',   /* Remove outline on focus */
                                    background: 'transparent' 
                                }}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim()}
                                className="send-btn"
        
                            >
                                <Send size={24}
                                    style={{ width: '24px', height: '24px' }}
                                />
                            </button>
                        </div>

                        <div className="disclaimer">
                            AI can make mistakes. Please verify important university dates.
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}