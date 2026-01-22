import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { Trash2, Search, User, Shield, Loader2, MessageSquare } from "lucide-react";
import { getAllUsers, deleteUser } from "../services/userService";
import "../css/UserManagement.css";

export default function UserManagement() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (email) => {
        if (!window.confirm(`Are you sure you want to delete user ${email}? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteUser(email);
            // Remove from local state to avoid reload
            setUsers(users.filter(u => u.email !== email));
        } catch (err) {
            alert("Failed to delete user: " + err.message);
        }
    };

    const filteredUsers = users.filter(user => 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleName = (user) => {
        if (typeof user.role === 'string') return user.role;
        if (user.role && typeof user.role === 'object' && user.role.name) return user.role.name;
        return 'STUDENT';
    };

    return (
        <AdminLayout title="User Management">
            <div className="user-management-page">
                
                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
                    <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input 
                        type="text" 
                        placeholder="Search students by email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            background: 'white',
                            color: 'black',
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            outline: 'none'
                        }}
                    />
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Role</th>
                                    <th>Joined Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="empty-state">No students found.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, index) => (
                                        <tr key={user.id || index}>
                                            <td data-label="Student">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '50%' }}>
                                                        <User size={20} color="#64748b" />
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500' }}>{user.fullName || "Unknown Name"}</div>
                                                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Role">
                                                <span className={`role-badge ${getRoleName(user).toLowerCase()}`}>
                                                    {getRoleName(user)}
                                                </span>
                                            </td>
                                            <td data-label="Joined Date">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                                            <td data-label="Actions">
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button 
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(user.email)}
                                                        title="Delete User"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <button 
                                                        className="btn-view-chat"
                                                        onClick={() => navigate(`/admin/student-chats/${user.userId || user.id}`)}
                                                        title="View Chat History"
                                                        style={{
                                                            background: '#e0f2fe',
                                                            color: '#0284c7',
                                                            border: 'none',
                                                            padding: '6px 12px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            transition: 'background 0.2s'
                                                        }}
                                                    >
                                                        <MessageSquare size={16} /> View Chat
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
