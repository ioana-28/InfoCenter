import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FileText, Clock, Bot, HelpCircle, User, Menu, X } from "lucide-react";
import '../css/StudentLayout.css';

export default function StudentLayout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hide sidebar on /student or /student/chat
  const hideSidebar = location.pathname === "/student" || location.pathname === "/student/chat";

  return (
    <div className="student-container">

      {/* Mobile Header (Visible only on mobile via CSS) */}
      {!hideSidebar && (
        <header className="student-mobile-header">
          <button className="student-menu-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="student-mobile-title">Student Portal</span>
        </header>
      )}

      {/* Mobile Overlay */}
      {!hideSidebar && (
        <div 
            className={`student-sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
            onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {!hideSidebar && (
        <aside className={`student-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="student-sidebar-header">
            <h2 className="student-sidebar-title">Student Portal</h2>
            <button className="student-close-btn" onClick={() => setIsSidebarOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <nav className="student-nav">
            <Link to="/student" className="student-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <Bot size={18} /> Chatbot
            </Link>
            
            <Link to="/student/request" className="student-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <FileText size={18} /> Request Documents
            </Link>

            <Link to="/student/history" className="student-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <Clock size={18} /> Request History
            </Link>

            <Link to="/student/faq" className="student-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <HelpCircle size={18} /> FAQ & Support
            </Link>

            <Link to="/student/profile" className="student-nav-item" onClick={() => setIsSidebarOpen(false)}>
              <User size={18} /> My Profile
            </Link>
          </nav>
        </aside>
      )}

      <main className="student-main">
        <Outlet />
      </main>

    </div>
  );
}
