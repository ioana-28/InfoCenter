import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { MessageSquare, ArrowLeft, Calendar, User, Bot, Clock, ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getConversationMessages, getConversationsByUserId } from '../services/chatService';
import '../css/AdminStudentChatView.css';

export default function AdminStudentChatView() {
    const { studentId } = useParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState("Student");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadStudentConversations();
    }, [studentId]);

    useEffect(() => {
        if (selectedConversationId) {
            loadMessages(selectedConversationId);
        }
    }, [selectedConversationId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadStudentConversations = async () => {
        setLoading(true);
        try {
            const data = await getConversationsByUserId(studentId);
            setConversations(data);
            
            // Only auto-select first conversation on Desktop (width > 768px)
            // On mobile, we want the user to see the list first.
            if (data.length > 0 && window.innerWidth > 768) {
                const firstId = data[0].id || data[0].sessionId;
                setSelectedConversationId(firstId);
            }

            if (data.length > 0 && data[0].user && data[0].user.fullName) {
                setStudentName(data[0].user.fullName);
            }
        } catch (error) {
            console.error("Failed to load student conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (sessionId) => {
        try {
            const msgs = await getConversationMessages(sessionId);
            
            const formattedMsgs = msgs.map(m => {
                let dateObj = new Date();
                const timeValue = m.sentAt || m.timestamp;

                if (timeValue) {
                    if (Array.isArray(timeValue)) {
                        dateObj = new Date(timeValue[0], timeValue[1] - 1, timeValue[2], timeValue[3] || 0, timeValue[4] || 0, timeValue[5] || 0);
                    } else {
                        const parsed = new Date(timeValue);
                        if (!isNaN(parsed.getTime())) dateObj = parsed;
                    }
                }

                const senderRaw = m.sender ? String(m.sender).toUpperCase().trim() : '';
                const isUser = senderRaw === 'USER' || senderRaw === 'STUDENT';

                return {
                    id: m.messageId || m.id,
                    text: m.messageText || m.text,
                    sender: isUser ? 'user' : 'bot',
                    timestamp: dateObj
                };
            });
            setMessages(formattedMsgs);
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Helper to handle clearing selection (Mobile Back button)
    const handleMobileBack = () => {
        setSelectedConversationId(null);
    };

    return (
        <AdminLayout title={`History: ${studentName}`}>
            {/* We add the class 'mobile-chat-open' if a conversation is selected.
                CSS uses this to toggle between Sidebar and Main Area on mobile.
            */}
            <div className={`chat-container ${selectedConversationId ? 'mobile-chat-open' : ''}`}>
                
                {/* Sidebar */}
                <aside className="chat-sidebar">
                    <div className="sidebar-header">
                        <button className="btn-back" onClick={() => navigate('/admin/users')}>
                            <ArrowLeft size={18} /> Back to Students
                        </button>
                    </div>
                    <div className="conversation-list">
                        {conversations.length === 0 ? (
                            <div className="empty-state">
                                <MessageSquare size={32} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>No history found</p>
                            </div>
                        ) : (
                            conversations.map((conv) => {
                                const convId = conv.id || conv.sessionId;
                                const isActive = selectedConversationId === convId;
                                return (
                                    <div 
                                        key={convId} 
                                        className={`conversation-item ${isActive ? 'active' : ''}`}
                                        onClick={() => setSelectedConversationId(convId)}
                                    >
                                        <div className="conv-title">
                                            {conv.title || "Untitled Conversation"}
                                        </div>
                                        <div className="conv-meta">
                                            <Calendar size={12} />
                                            {conv.startedAt ? new Date(conv.startedAt).toLocaleDateString() : 'Unknown Date'}
                                            <span>•</span>
                                            <Clock size={12} />
                                            {conv.startedAt ? new Date(conv.startedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '--:--'}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </aside>

                {/* Main Chat Area */}
                <main className="chat-main-area">
                    {selectedConversationId ? (
                        <>
                            <header className="chat-header">
                                {/* Mobile Only Back Button */}
                                <button className="btn-mobile-back" onClick={handleMobileBack}>
                                    <ChevronLeft size={24} />
                                </button>

                                <div className="user-avatar-sm">
                                    <User size={20} color="#2563eb" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{studentName}</div>
                                </div>
                            </header>

                            <div className="messages-container">
                                {messages.map((message) => {
                                    const isUser = message.sender === 'user';
                                    return (
                                        <div key={message.id} className={`message-row ${isUser ? 'user' : 'bot'}`}>
                                            {!isUser && (
                                                <div className="avatar-icon bot">
                                                    <Bot size={18} color="#64748b" />
                                                </div>
                                            )}
                                            
                                            <div className="message-bubble">
                                                <ReactMarkdown>{message.text}</ReactMarkdown>
                                                <div className="message-timestamp">
                                                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                                </div>
                                            </div>

                                            {isUser && (
                                                <div className="avatar-icon user">
                                                    <User size={18} color="#2563eb" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef}/>
                            </div>
                        </>
                    ) : (
                        <div className="empty-chat-area">
                            <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                            <p>Select a conversation from the left to view details</p>
                        </div>
                    )}
                </main>
            </div>
        </AdminLayout>
    );
}