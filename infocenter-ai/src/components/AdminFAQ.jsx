import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { MessageSquare, Send, CheckCircle, Loader2, Trash2, Search, Filter } from "lucide-react";
import { getAdminAllFAQs, answerQuestion, deleteQuestion } from "../services/faqService";
import "../css/AdminFAQ.css";
import "../css/animations.css";

export default function AdminFAQ() {
  const [questions, setQuestions] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("ALL"); // ALL, PENDING, ANSWERED

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    const data = await getAdminAllFAQs();
    // Sort pending first, then by date/ID
    data.sort((a, b) => {
      if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
      if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
      const idA = a.id || a.faqId || 0;
      const idB = b.id || b.faqId || 0;
      return idB - idA;
    });
    setQuestions(data);
  };

  const getQuestionId = (q) => q.id || q.faqId;

  const handleAnswerChange = (id, value) => {
    setQuestions((prev) =>
      prev.map((q) =>
        getQuestionId(q) === id ? { ...q, answer: value } : q
      )
    );
  };

  const handleSubmitAnswer = async (id) => {
    const question = questions.find(q => getQuestionId(q) === id);
    if (question) {
      setSubmittingId(id);
      try {
        await answerQuestion(id, question.answer, true);
        await loadQuestions();
      } catch (error) {
        console.error("Failed to submit answer", error);
        alert("Failed to send answer. Please try again.");
      } finally {
        setSubmittingId(null);
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await deleteQuestion(id);
      setQuestions(questions.filter(q => getQuestionId(q) !== id));
    } catch (error) {
      console.error("Failed to delete question", error);
      alert("Failed to delete question.");
    }
  };

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "PENDING") return q.status === "PENDING";
    if (filterStatus === "ANSWERED") return q.status === "PUBLISHED" || q.status === "ANSWERED";
    return true;
  });

  return (
    <AdminLayout title="Student Questions">
      <div className="faq-page">

        {/* Modern Segmented Filter Control */}
        <div className="filter-container">
          <div className="filter-group">
            <button 
              className={`filter-btn ${filterStatus === "ALL" ? "active" : ""}`}
              onClick={() => setFilterStatus("ALL")}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filterStatus === "PENDING" ? "active" : ""}`}
              onClick={() => setFilterStatus("PENDING")}
            >
              Pending
              {questions.some(q => q.status === 'PENDING') && <span className="dot-indicator"></span>}
            </button>
            <button 
              className={`filter-btn ${filterStatus === "ANSWERED" ? "active" : ""}`}
              onClick={() => setFilterStatus("ANSWERED")}
            >
              Answered
            </button>
          </div>
          <div className="filter-count">
            {filteredQuestions.length} Questions
          </div>
        </div>

        {/* Questions List */}
        <div className="faq-list">
          {filteredQuestions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Search size={40} /></div>
              <h3>No questions found</h3>
              <p>There are no questions matching the current filter.</p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const qId = getQuestionId(q);
              const isAnswered = q.status === "PUBLISHED" || q.status === "ANSWERED";
              
              return (
                <div key={qId} className="faq-card fade-in">
                  
                  {/* Card Header */}
                  <div className="faq-header">
                    <div className="student-info">
                      <div className="avatar-placeholder">
                        <MessageSquare size={16} />
                      </div>
                      <div className="meta">
                        <span className="email">{q.submittedBy?.email || 'Anonymous'}</span>
                        <span className="date">
                          {q.createdAt ? new Date(q.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                        </span>
                      </div>
                    </div>

                    <div className="actions">
                      <span className={`status-pill ${isAnswered ? "success" : "warning"}`}>
                        {isAnswered ? <CheckCircle size={12} /> : null}
                        {isAnswered ? "Answered" : "Pending"}
                      </span>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(qId)}
                        title="Delete Question"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Question Body */}
                  <div className="faq-body">
                    <div className="section-label">Question</div>
                    <div className="question-text">{q.question}</div>
                  </div>

                  {/* Answer Input Area */}
                  <div className="faq-footer">
                    <div className="section-label">Admin Response</div>
                    <div className="input-wrapper">
                      <textarea
                        placeholder={isAnswered ? "Answer published." : "Type your response here..."}
                        value={q.answer || ''}
                        disabled={isAnswered}
                        onChange={(e) => handleAnswerChange(qId, e.target.value)}
                        className={isAnswered ? "disabled" : ""}
                      />
                      
                      {!isAnswered && (
                        <button
                          className="submit-btn"
                          onClick={() => handleSubmitAnswer(qId)}
                          disabled={!q.answer || !q.answer.trim() || submittingId === qId}
                        >
                          {submittingId === qId ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <>Submit <Send size={16} /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AdminLayout>
  );
}