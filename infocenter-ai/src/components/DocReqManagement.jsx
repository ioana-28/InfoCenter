import React, {useState, useEffect} from "react";
import AdminLayout from "./AdminLayout";
import {CheckCircle, XCircle, Loader2, Trash2, ChevronDown, ChevronUp} from "lucide-react";
import { getAllRequests, approveRequest, rejectRequest, deleteRequest } from "../services/docReqService";
import "../css/DocReqManagement.css";
import "../css/animations.css";

export default function DocumentRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [expandedRows, setExpandedRows] = useState(new Set());
    
    // Modal state
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getAllRequests();
        console.log("Fetched requests:", data); // Debugging: Check the structure of the data
        // Sort by ID descending
        data.sort((a, b) => (b.id || b.requestId || 0) - (a.id || a.requestId || 0));
        setRequests(data);
        setLoading(false);
    };

    // Helper to get the ID from the request object, handling potential field name mismatches
    const getRequestId = (req) => req.id || req.requestId;

    const toggleDetails = (id) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const handleApprove = async (id) => {
        if (!id) {
            alert("Error: Request ID is missing.");
            return;
        }
        setProcessingId(id);
        const approvalReason = "Your document has been successfully generated. You may pick it up at the InfoCenter during our regular opening hours."
        try {
            await approveRequest(id, approvalReason);
            await loadRequests();
        } catch (error) {
            console.error("Approve error:", error);
            alert(`Failed to approve request: ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const openRejectModal = (id) => {
        setSelectedRequestId(id);
        setRejectionReason("");
        setShowRejectModal(true);
    };

    const handleConfirmReject = async () => {
        if (!selectedRequestId) return;
        
        setProcessingId(selectedRequestId);
        setShowRejectModal(false); // Close modal immediately
        
        try {
            await rejectRequest(selectedRequestId, rejectionReason);
            await loadRequests();
        } catch (error) {
            alert("Failed to reject request.");
        } finally {
            setProcessingId(null);
            setSelectedRequestId(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this request record?")) return;
        
        setProcessingId(id);
        try {
            await deleteRequest(id);
            // Optimistic update or reload
            setRequests(prev => prev.filter(req => getRequestId(req) !== id));
        } catch (error) {
            console.error("Delete error:", error);
            // Check for 403 specifically to give a better message
            if (error.message.includes("403")) {
                alert("Permission denied: The server does not allow deleting this request (it may be approved/rejected already).");
            } else {
                alert(`Failed to delete request: ${error.message}`);
            }
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <AdminLayout title="Document Requests">
            <div className="document-requests-page">
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                        <Loader2 className="animate-spin" size={32} color="#3b82f6" />
                    </div>
                ) : requests.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>No document requests found.</p>
                ) : (
                    <table className="requests-table">
                        <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Student Name</th>
                            <th>Document</th>
                            <th>Request Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th style={{ width: '50px' }}></th>
                        </tr>
                        </thead>
                        <tbody>
                        {requests.map((req) => {
                            const reqId = getRequestId(req);
                            const isExpanded = expandedRows.has(reqId);
                            return (
                            <React.Fragment key={reqId}>
                            <tr>
                                <td>
                                    <button 
                                        className="btn-expand-details"
                                        onClick={() => toggleDetails(reqId)}
                                        title={isExpanded ? "Hide Details" : "Show Details"}
                                    >
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                </td>
                                <td>{req.studentName || req.student?.email || "Unknown"}</td>
                                <td>{req.documentType}</td>
                                <td>{(req.requestDate || req.requestedAt) ? new Date(req.requestDate || req.requestedAt).toLocaleDateString() : "-"}</td>
                                <td>
                                    <span className={`status-badge ${req.status?.toLowerCase()}`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    {req.status === "PENDING" ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleApprove(reqId)}
                                                disabled={processingId === reqId}
                                            >
                                                {processingId === reqId ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle size={16}/>} 
                                                Approve
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => openRejectModal(reqId)}
                                                disabled={processingId === reqId}
                                            >
                                                <XCircle size={16}/> Reject
                                            </button>
                                        </div>
                                    ) : null}
                                    {req.status === "REJECTED" && req.adminReason && (
                                        <div style={{ fontSize: '0.85rem', color: '#ef4444', marginTop: '4px' }}>
                                            Reason: {req.adminReason}
                                        </div>
                                    )}
                                    {req.status === "APPROVED" && req.adminReason && (
                                        <div style={{ fontSize: '0.85rem', color: '#166534', marginTop: '4px' }}>
                                            Note: {req.adminReason}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {req.status !== "PENDING" && (
                                        <button
                                            className="btn-icon-delete"
                                            onClick={() => handleDelete(reqId)}
                                            disabled={processingId === reqId}
                                            title="Delete Request"
                                        >
                                            {processingId === reqId ? <Loader2 size={18} className="animate-spin"/> : <Trash2 size={18}/>}
                                        </button>
                                    )}
                                </td>
                            </tr>
                            {isExpanded && (
                                <tr className="details-row">
                                    <td colSpan="7">
                                        <div className="details-content">
                                            <strong>Student Details:</strong>
                                            <p>{req.details || "No additional details provided."}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </React.Fragment>
                        )})}
                        </tbody>
                    </table>
                )}

                {/* Rejection Modal */}
                {showRejectModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h3>Reject Request</h3>
                            <p style={{ marginBottom: '0.5rem', color: '#64748b' }}>Please provide a reason for rejection:</p>
                            <textarea
                                className="modal-textarea"
                                rows="4"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="e.g., Missing information, Invalid document type..."
                            />
                            <div className="modal-actions">
                                <button 
                                    className="btn-cancel"
                                    onClick={() => setShowRejectModal(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="btn-confirm-reject"
                                    onClick={handleConfirmReject}
                                    disabled={!rejectionReason.trim()}
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
