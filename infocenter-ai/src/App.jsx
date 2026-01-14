import React, { useState, useEffect } from "react";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Chatbot } from "./components/Chatbot";

import AdminDashboard from "./components/AdminDashboard";
import DocReqManagement from "./components/DocReqManagement";
import OfficialDocMan from "./components/OfficialDocMan";
import FAQ from "./components/AdminFAQ";
import UserManagement from "./components/UserManagement";
import AdminStudentChatView from "./components/AdminStudentChatView";

import StudentLayout from "./components/StudentLayout";
import StudentDocReq from "./components/StudentDocReq";
import StudentReqHistory from "./components/StudentReqHistory";
import StudentProfile from "./components/StudentProfile";
import StudentFAQ from "./components/StudentFAQ";

import ProtectedRoute from "./services/ProtectedRoute";


function App() {
  const [userEmail, setUserEmail] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token && email) {
        setUserEmail(email);
        setIsLoggedIn(true);
      }
  }, []);

  return (
    <Router>
      <Routes>

        {/* ---------------- AUTH ---------------- */}
        <Route
          path="/login"
          element={
            <Login
              onLogin={(email) => {
                setUserEmail(email);
                setIsLoggedIn(true);
              }}
            />
          }
        />

        <Route
          path="/register"
          element={
            <Register
              onRegister={(email) => {
                setUserEmail(email);
                setIsLoggedIn(true);
              }}
            />
          }
        />

        {/* ---------------- STUDENT PORTAL ---------------- */}

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout
                isLoggedIn={isLoggedIn}
                userEmail={userEmail}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserEmail("");
                }}
              />
            </ProtectedRoute>
          }
        >
          {/* Default: redirect /student to /student/chat */}
          <Route index element={<Navigate to="chat" replace />} />

          {/* Chatbot */}
          <Route
            path="chat"
            element={
              <Chatbot
                isLoggedIn={isLoggedIn}
                userEmail={userEmail}
                onLogout={() => {
                  setIsLoggedIn(false);
                  setUserEmail("");
                }}
              />
            }
          />

          <Route path="request" element={<StudentDocReq userEmail={userEmail}/>} />
          <Route path="history" element={<StudentReqHistory userEmail={userEmail} />} />
          <Route path="faq" element={<StudentFAQ />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* ---------------- ADMIN ---------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
          </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <DocReqManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/student-chats/:studentId"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminStudentChatView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/documents"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <OfficialDocMan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/faqs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <FAQ />
            </ProtectedRoute>
          }
        />

        {/* ---------------- DEFAULT ---------------- */}
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </Router>
  );
}

export default App;
