package org.infocenter.universitychatbot.model;


import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "document_requests")
public class DocumentRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "document_request_seq_gen")
    @SequenceGenerator(name = "document_request_seq_gen", sequenceName = "document_requests_seq", allocationSize = 1)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @Column(nullable = false, length = 50)
    private String documentType;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(length = 20)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(nullable = false)
    private Timestamp requestedAt = new Timestamp(System.currentTimeMillis());

    @Column(name = "admin_response_date")
    private Timestamp adminResponseDate;

    @Column(columnDefinition = "TEXT")
    private String adminReason;

    @Column(name = "drive_file_id")
    private String driveFileId;


    public DocumentRequest() {}

    public DocumentRequest(User student, String documentType, String status, String details) {
        this.student = student;
        this.documentType = documentType;
        this.status = status;
        this.details = details;
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAdminReason() {
        return adminReason;
    }

    public void setAdminReason(String adminReason) {
        this.adminReason = adminReason;
    }

    public Timestamp getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(Timestamp requestedAt) {
        this.requestedAt = requestedAt;
    }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Timestamp getAdminResponseDate() {
        return adminResponseDate;
    }

    public void setAdminResponseDate(Timestamp adminResponseDate) {
        this.adminResponseDate = adminResponseDate;
    }

    public String getDriveFileId() {
        return driveFileId;
    }

    public void setDriveFileId(String driveFileId) {
        this.driveFileId = driveFileId;
    }
}
