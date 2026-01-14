import React, { useEffect, useState } from "react";
import { User, Mail, Shield, Calendar, BookOpen, Edit2, Lock } from "lucide-react"; 
import "../css/StudentProfile.css";

export default function StudentProfile() {
    const [user, setUser] = useState({
        email: "Loading...",
        role: "Student",
        joinDate: "..."
    });

    useEffect(() => {
        // Fetch user info from localStorage or decode token
        const email = localStorage.getItem("email") || "student@e-uvt.ro";
        
        setUser({
            email: email,
            role: "Student",
            joinDate: new Date().toLocaleDateString(),
            department: "Computer Science"
        });
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
                
                {/* 1. Header Section (Gradient Background) */}
                <div className="profile-header-section">
                    <div className="profile-avatar-wrapper">
                        <div className="profile-avatar">
                            <User size={48} strokeWidth={1.5} />
                        </div>
                    </div>
                    <h2 className="profile-name">Student Account</h2>
                    <span className="profile-role-badge">{user.role}</span>
                </div>

                {/* 2. Content Section */}
                <div className="profile-content">
                    <div className="profile-section">
                        <h3>Personal Information</h3>
                        
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">Email Address</span>
                                <div className="info-value">
                                    <Mail size={16} className="info-icon" />
                                    {user.email}
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <span className="info-label">Department</span>
                                <div className="info-value">
                                    <BookOpen size={16} className="info-icon" />
                                    {user.department}
                                </div>
                            </div>

                            <div className="info-item">
                                <span className="info-label">Member Since</span>
                                <div className="info-value">
                                    <Calendar size={16} className="info-icon" />
                                    {user.joinDate}
                                </div>
                            </div>

                             <div className="info-item">
                                <span className="info-label">Account Status</span>
                                <div className="info-value">
                                    <Shield size={16} className="info-icon" />
                                    Active
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. Actions Section */}
                    <div className="profile-actions">
                        <button className="btn-secondary" onClick={() => alert("Edit functionality coming soon!")}>
                             <Edit2 size={16} /> Edit Profile
                        </button>
                        <button className="btn-secondary" onClick={() => alert("Password change functionality coming soon!")}>
                             <Lock size={16} /> Change Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}