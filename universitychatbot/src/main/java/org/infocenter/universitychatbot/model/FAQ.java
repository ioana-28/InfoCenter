package org.infocenter.universitychatbot.model;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "faq_entries")
public class FAQ {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faqId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(columnDefinition = "TEXT")
    private String answer;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy; // Admin who answered/uploaded

    @ManyToOne
    @JoinColumn(name = "submitted_by")
    private User submittedBy; // Student who asked the question

    @Column(length = 20, nullable = false)
    private String status = "PENDING"; // PENDING, ANSWERED, PUBLISHED

    @Column(nullable = false, updatable = false)
    private Timestamp createdAt = new Timestamp(System.currentTimeMillis());

    @Column
    private Timestamp answeredAt;

    public FAQ() {}

    public FAQ(String question, String answer, User uploadedBy) {
        this.question = question;
        this.answer = answer;
        this.uploadedBy = uploadedBy;
        this.status = "ANSWERED";
    }

    // Constructor for student questions
    public FAQ(String question, User submittedBy) {
        this.question = question;
        this.submittedBy = submittedBy;
        this.status = "PENDING";
    }

    // Getters and Setters
    public Long getFaqId() {
        return faqId;
    }

    public void setFaqId(Long faqId) {
        this.faqId = faqId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public User getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    public User getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(User submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getAnsweredAt() {
        return answeredAt;
    }

    public void setAnsweredAt(Timestamp answeredAt) {
        this.answeredAt = answeredAt;
    }
}
