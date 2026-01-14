import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import AdminLayout from "./AdminLayout";
import { Users, Clock, FileText, MessageCircle, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import "../css/AdminDashboard.css";

export default function AdminDashboard() {
    const navigate = useNavigate(); // Hook for navigation

    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        pendingRequests: 0,
        pendingFaqs: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");

            if (!token || role !== "ADMIN") {
                setError("Unauthorized access.");
                return;
            }

            try {
                const headers = { Authorization: `Bearer ${token}` };

                // 1. Fetch Stats (Existing)
                const statsRes = await fetch("http://localhost:8080/api/admin/stats", { headers });
                const statsJson = statsRes.ok ? await statsRes.json() : { totalActiveStudents: 0, totalPendingRequests: 0 };

                // 2. Fetch All Requests (For Activity Feed)
                const reqRes = await fetch("http://localhost:8080/api/admin/requests", { headers });
                const reqJson = reqRes.ok ? await reqRes.json() : [];

                // 3. Fetch All FAQs (For Activity Feed & Pending Count)
                const faqRes = await fetch("http://localhost:8080/api/faqs/admin/all", { headers });
                const faqJson = faqRes.ok ? await faqRes.json() : [];

                // --- Process Data ---

                // Calculate Pending FAQs manually if backend stats doesn't provide it
                const pendingFaqsCount = faqJson.filter(f => f.status === "PENDING").length;

                setStatsData({
                    totalUsers: statsJson.totalActiveStudents,
                    pendingRequests: statsJson.totalPendingRequests,
                    pendingFaqs: pendingFaqsCount
                });

                // Helper to find the most recent relevant date in an object
                const getLatestDate = (item, fallbackDate) => {
                    let maxDate = fallbackDate;
                    // Keys to ignore (birthdays, future deadlines, etc.)
                    const ignoreKeys = ['dob', 'birth', 'deadline', 'expire', 'start', 'end', 'valid']; 
                    
                    Object.keys(item).forEach(key => {
                        // Check if value is a string and looks like a date
                        if (item[key] && typeof item[key] === 'string' && !ignoreKeys.some(k => key.toLowerCase().includes(k))) {
                            const d = new Date(item[key]);
                            // Check if valid date and is more recent than fallback
                            if (!isNaN(d.getTime()) && d > maxDate && d.getFullYear() > 2020) { 
                                maxDate = d;
                            }
                        }
                    });
                    return maxDate;
                };

                // Merge Requests and FAQs into a single "Activity Stream"
                const formattedRequests = reqJson.map(item => {
                    const createdDate = new Date(item.requestedAt || item.requestDate || new Date());
                    const effectiveDate = getLatestDate(item, createdDate);

                    let actionText = `Requested: ${item.documentType}`;
                    if (item.status === "APPROVED") actionText = `Approved: ${item.documentType}`;
                    if (item.status === "REJECTED") actionText = `Rejected: ${item.documentType}`;

                    return {
                        type: "Document",
                        user: item.student?.email || item.student?.username || item.studentName || "Unknown",
                        action: actionText,
                        time: effectiveDate.toISOString(),
                        status: item.status,
                        rawDate: effectiveDate
                    };
                });

                const formattedFaqs = faqJson.map(item => {
                    const createdDate = new Date(item.createdAt || new Date());
                    const effectiveDate = getLatestDate(item, createdDate);

                    let actionText = `Asked: "${item.question.substring(0, 20)}..."`;
                    if (item.status === "ANSWERED" || item.status === "PUBLISHED") actionText = `Answered: "${item.question.substring(0, 20)}..."`;

                    return {
                        type: "Question",
                        user: item.submittedBy?.email || "Anonymous",
                        action: actionText,
                        time: effectiveDate.toISOString(),
                        status: item.status,
                        rawDate: effectiveDate
                    };
                });

                // Combine, Sort by Date (Newest First), and take top 5
                const combinedActivity = [...formattedRequests, ...formattedFaqs]
                    .sort((a, b) => b.rawDate - a.rawDate)
                    .slice(0, 5);

                setRecentActivity(combinedActivity);
                setLoading(false);

            } catch (err) {
                console.error("Dashboard load error:", err);
                setError("Failed to load dashboard data.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to format date nicely (e.g., "2 hours ago" or "Dec 30")
    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const stats = [
        {
            label: "Total Users",
            value: statsData.totalUsers,
            icon: <Users size={24} color="#0f2a55" />,
            bg: "#e3f2fd",
            link: "/admin/users"
        },
        {
            label: "Pending Docs",
            value: statsData.pendingRequests,
            icon: <FileText size={24} color="#f59e0b" />,
            bg: "#fffbeb",
            link: "/admin/requests"
        },
        {
            label: "Unanswered Qs",
            value: statsData.pendingFaqs,
            icon: <MessageCircle size={24} color="#d946ef" />, // Pink for questions
            bg: "#fdf4ff",
            link: "/admin/faqs"
        }
    ];

    return (
        <AdminLayout title="Dashboard Overview">
            <div className="admin-dashboard">
                {error && <div className="error-message">{error}</div>}
                
                {/* 1. Stats Row */}
                <div className="stats-grid">
                    {stats.map((s, i) => (
                        <div 
                            className="stat-card" 
                            key={i}
                            onClick={() => s.link && navigate(s.link)}
                            style={{ cursor: s.link ? 'pointer' : 'default' }}
                        >
                            <div className="stat-icon-wrapper" style={{ backgroundColor: s.bg }}>
                                {s.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{loading ? "..." : s.value}</h3>
                                <p>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 2. Main Panels */}
                <div className="dashboard-panels">

                    {/* Panel A: Real Recent Activity Table */}
                    <div className="panel-box large-panel">
                        <div className="panel-header">
                            <h2>Recent Activity</h2>
                        </div>
                        {loading ? <p>Loading activity...</p> : (
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>User</th>
                                        <th>Action</th>
                                        <th>Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentActivity.length === 0 ? (
                                        <tr><td colSpan="5">No recent activity found.</td></tr>
                                    ) : (
                                        recentActivity.map((item, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {item.type === "Document" ? 
                                                        <FileText size={16} className="text-muted"/> : 
                                                        <MessageCircle size={16} className="text-muted"/>
                                                    }
                                                </td>
                                                <td className="fw-500">{item.user}</td>
                                                <td>{item.action}</td>
                                                <td className="text-muted" style={{fontSize: '0.85rem'}}>
                                                    {formatDate(item.time)}
                                                </td>
                                                <td>
                                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Panel B */}
                    <div className="panel-box small-panel">
                        <div className="panel-header">
                            <h2>Action Center</h2>
                        </div>
                        <div className="health-list">
                            <div className="health-item">
                                <div className="health-info">
                                    <AlertCircle size={18} color={statsData.pendingRequests > 0 ? "#f59e0b" : "#10b981"} />
                                    <span>Document Requests</span>
                                </div>
                                {statsData.pendingRequests > 0 ? 
                                    <span className="badge-warning">{statsData.pendingRequests} Pending</span> : 
                                    <span className="badge-online">All Clear</span>
                                }
                            </div>
                            <div className="health-item">
                                <div className="health-info">
                                    <AlertCircle size={18} color={statsData.pendingFaqs > 0 ? "#f59e0b" : "#10b981"} />
                                    <span>Student Questions</span>
                                </div>
                                {statsData.pendingFaqs > 0 ? 
                                    <span className="badge-warning">{statsData.pendingFaqs} Unanswered</span> : 
                                    <span className="badge-online">All Clear</span>
                                }
                            </div>
                        </div>

                        <div className="divider"></div>

                        <div className="quick-actions">
                            <h3>Quick Navigation</h3>
                            <button className="action-btn" onClick={() => navigate('/admin/documents')}>
                                Review Documents <ArrowRight size={16} />
                            </button>
                            <button className="action-btn" onClick={() => navigate('/admin/faqs')}>
                                Answer Questions <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AdminLayout>
    );
}