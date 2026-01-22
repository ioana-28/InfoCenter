import React, { useState, useEffect } from 'react';
import { Send, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getMyQuestions, getAllPublishedFAQs, askQuestion } from '../services/faqService';
import '../css/StudentFAQ.css';

export default function StudentFAQ() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [filter, setFilter] = useState('all'); // 'all', 'my', 'answered'

  const getQuestionId = (q) => q.id || q.faqId;

  useEffect(() => {
    loadQuestions();
    // Poll for updates every few seconds to see new answers
    const interval = setInterval(loadQuestions, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const loadQuestions = async () => {
    let data = [];
    if (filter === 'my') {
      data = await getMyQuestions();
    } else {
      data = await getAllPublishedFAQs();
    }
    // Sort by ID descending (newest first)
    data.sort((a, b) => getQuestionId(b) - getQuestionId(a));
    setQuestions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await askQuestion(newQuestion);
      // If we are viewing "my questions", reload immediately. 
      // If viewing "all", we might not see it until it's published, but let's reload anyway.
      await loadQuestions();
      setNewQuestion("");
      if (filter !== 'my') {
          alert("Question submitted! It will appear in 'My Questions' immediately, and in 'All Questions' once answered/published.");
      }
    } catch (error) {
      console.error("Failed to submit question", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const currentUserEmail = localStorage.getItem("email");

  // Client-side filtering is now mostly handled by server endpoints, 
  // but we still might want to filter 'answered' from the fetched list if needed.
  const filteredQuestions = questions.filter(q => {
    if (filter === 'answered') return q.status === 'PUBLISHED' || q.answer; 
    return true;
  });

  return (
    <div className="student-faq-container">
      {/* NEW: White Card Container to match other pages */}
      <div className="faq-card">
        
        <div className="faq-header-section">
          <h1>Questions & Support</h1>
          <p>Ask questions and view answers from the administration.</p>
        </div>

        <div className="faq-ask-section">
          <h3>Ask a Question</h3>
          <form onSubmit={handleSubmit} className="faq-form">
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Type your question here..."
              rows="3"
              className="faq-input"
            />
            <button type="submit" className="faq-submit-btn">
              <Send size={18} /> Submit Question
            </button>
          </form>
        </div>

        <div className="faq-list-section">
          <div className="faq-filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Questions
            </button>
            <button 
              className={`filter-btn ${filter === 'answered' ? 'active' : ''}`}
              onClick={() => setFilter('answered')}
            >
              Answered
            </button>
            <button 
              className={`filter-btn ${filter === 'my' ? 'active' : ''}`}
              onClick={() => setFilter('my')}
            >
              My Questions
            </button>
          </div>

          <div className="faq-list">
            {filteredQuestions.length === 0 ? (
              <p className="no-questions">No questions found.</p>
            ) : (
              filteredQuestions.map((q) => {
                const qId = getQuestionId(q);
                return (
                  <div key={qId} className={`faq-item ${q.status}`}>
                    <div className="faq-question-header" onClick={() => toggleExpand(qId)}>
                      <div className="faq-question-content">
                        <span className="faq-status-badge">{q.status}</span>
                        <h4 className="question-text">{q.question}</h4>
                        <span className="question-meta">
                          Asked by {q.submittedBy?.email === currentUserEmail ? 'You' : (q.submittedBy?.email || 'Student')} • {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      {q.answer && (
                        <button className="expand-btn">
                          {expandedIds.has(qId) ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      )}
                    </div>
                    
                    {q.answer && expandedIds.has(qId) && (
                      <div className="faq-answer-body">
                        <div className="answer-icon">
                          <MessageCircle size={20} />
                        </div>
                        <div className="answer-content">
                          <h5>Admin Response:</h5>
                          <p>{q.answer}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}