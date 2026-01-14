import React, { useState } from "react";
import "../css/AdminLayout.css";
import { Users, FileText, Upload, HelpCircle, User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout({ title, children }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const adminEmail = localStorage.getItem("email") || "Admin User";

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        navigate("/login");
    };

    return (
        <div className="admin-container">
            {/* Mobile Overlay */}
            <div 
                className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-icon">
                        <LayoutDashboard size={24} color="#fff" />
                    </div>
                    <h2 className="admin-sidebar-title">Uni Admin</h2>
                    <button className="close-sidebar-btn" onClick={() => setIsSidebarOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <NavLink 
                        to="/admin/dashboard" 
                        end 
                        className="admin-nav-item"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Users size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/requests" 
                        className="admin-nav-item"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <FileText size={20} />
                        <span>Requests</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/documents" 
                        className="admin-nav-item"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Upload size={20} />
                        <span>Documents</span>
                    </NavLink>
                    
                    <NavLink 
                        to="/admin/faqs" 
                        className="admin-nav-item"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <HelpCircle size={20} />
                        <span>FAQs</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <p>© 2025 InfoCenter</p>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <header className="admin-topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle-btn" onClick={() => setIsSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        <h1 className="page-title">{title}</h1>
                    </div>

                    {/* Glassy User Pill */}
                    <div className="admin-user-pill">
                        <div className="user-avatar">
                            <User size={18} />
                        </div>
                        <span className="email-text">{adminEmail}</span>
                        <div className="divider"></div>
                        <button 
                            onClick={handleLogout} 
                            className="logout-btn-icon"
                            title="Sign out"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                <div className="admin-content">
                    {children}
                </div>
            </main>
        </div>
    );
}