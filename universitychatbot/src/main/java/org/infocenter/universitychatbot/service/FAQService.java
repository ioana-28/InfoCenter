package org.infocenter.universitychatbot.service;

import org.infocenter.universitychatbot.model.FAQ;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.FAQRepository;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;
import java.util.List;

@Service
public class FAQService {

    private final FAQRepository faqRepository;

    public FAQService(FAQRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    // Get all published FAQs (for public viewing)
    public List<FAQ> getAllFAQs() {
        return faqRepository.findByStatusOrderByCreatedAtDesc("PUBLISHED");
    }

    // Get all FAQs including pending ones (for admin)
    public List<FAQ> getAllFAQsForAdmin() {
        return faqRepository.findAll();
    }

    // Admin creates a new FAQ directly
    public FAQ createFAQ(String question, String answer, User admin) {
        FAQ faq = new FAQ(question, answer, admin);
        faq.setStatus("PUBLISHED");
        return faqRepository.save(faq);
    }

    // Student submits a question
    public FAQ submitQuestion(String question, User student) {
        FAQ faq = new FAQ(question, student);
        return faqRepository.save(faq);
    }

    // Admin answers a pending question
    public FAQ answerQuestion(Long faqId, String answer, User admin, boolean publish) {
        FAQ faq = getFAQById(faqId);
        faq.setAnswer(answer);
        faq.setUploadedBy(admin);
        faq.setAnsweredAt(new Timestamp(System.currentTimeMillis()));
        faq.setStatus(publish ? "PUBLISHED" : "ANSWERED");
        return faqRepository.save(faq);
    }

    // Get pending questions for admin review
    public List<FAQ> getPendingQuestions() {
        return faqRepository.findByStatusOrderByCreatedAtAsc("PENDING");
    }

    // Get answered questions (both published and private answers)
    public List<FAQ> getAnsweredQuestions() {
        return faqRepository.findByStatusOrderByCreatedAtDesc("ANSWERED");
    }

    // Get student's own questions
    public List<FAQ> getQuestionsByStudent(User student) {
        return faqRepository.findBySubmittedByOrderByCreatedAtDesc(student);
    }

    // Count pending questions
    public long getPendingQuestionsCount() {
        return faqRepository.countByStatus("PENDING");
    }

    public FAQ getFAQById(Long id) {
        return faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ entry not found"));
    }

    public FAQ updateFAQ(FAQ faq) {
        return faqRepository.save(faq);
    }

    public void deleteFAQ(Long id) {
        FAQ faq = faqRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FAQ entry not found"));
        faqRepository.delete(faq);
    }
}