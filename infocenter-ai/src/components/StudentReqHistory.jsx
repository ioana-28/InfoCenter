import React, { useEffect, useState } from "react";
import { FileText, Calendar, AlertCircle, MessageSquare } from "lucide-react";
import "../css/StudentLayout.css";
import "../css/StudentReqHistory.css";

export default function StudentReqHistory({ userEmail }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!userEmail) return;

    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_Base_URL}/student/history?email=${encodeURIComponent(userEmail)}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userEmail]);

  const getStatusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "approved":
        return "status-approved";
      case "pending":
        return "status-pending";
      case "rejected":
        return "status-rejected";
      default:
        return "";
    }
  };

  if (!userEmail) {
    return (
      <div className="student-page">
        <div className="empty-state">
          <p>Please log in to view your requests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page">
      <div className="history-card">
        <h2>My Document Requests</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error-box">{error}</div>
        ) : requests.length > 0 ? (
          <div className="table-responsive">
            <table className="history-table">
              <thead>
                <tr>
                  <th>
                    <div className="th-content">
                      <FileText size={16} /> Document
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <Calendar size={16} /> Date
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <AlertCircle size={16} /> Status
                    </div>
                  </th>
                  <th>
                    <div className="th-content">
                      <MessageSquare size={16} /> Reason
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req.requestId}>
                    <td className="doc-name">{req.documentType}</td>
                    <td className="doc-date">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span
                        className={`status-badge ${getStatusClass(req.status)}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="doc-reason">
                      {req.adminReason ? (
                        <span className={
                          (req.status || "").toUpperCase() === "REJECTED" 
                            ? "rejection-reason" 
                            : (req.status || "").toUpperCase() === "APPROVED"
                              ? "approval-reason"
                              : ""
                        }>
                          {req.adminReason}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No document requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
