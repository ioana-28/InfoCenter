package org.infocenter.universitychatbot.controller;

import org.infocenter.universitychatbot.model.FAQ;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.service.FAQService;
import org.infocenter.universitychatbot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/faqs")
public class FAQController {

    private final FAQService faqService;
    private final UserService userService;

    public FAQController(FAQService faqService, UserService userService) {
        this.faqService = faqService;
        this.userService = userService;
    }

    // Get all published FAQs (public access)
    @GetMapping
    public ResponseEntity<List<FAQ>> getAllFAQs() {
        return ResponseEntity.ok(faqService.getAllFAQs());
    }

    // Student submits a question
    @PostMapping("/ask")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<FAQ> askQuestion(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> payload) {

        // Extract token without "Bearer " prefix
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        User student = userService.getUserFromToken(jwtToken);
        String question = payload.get("question");

        FAQ submittedQuestion = faqService.submitQuestion(question, student);
        return ResponseEntity.ok(submittedQuestion);
    }

    // Student gets their own questions
    @GetMapping("/my-questions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FAQ>> getMyQuestions(
            @RequestHeader("Authorization") String token) {

        // Extract token without "Bearer " prefix
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        User student = userService.getUserFromToken(jwtToken);
        List<FAQ> questions = faqService.getQuestionsByStudent(student);
        return ResponseEntity.ok(questions);
    }

    // Admin gets all pending questions
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FAQ>> getPendingQuestions() {
        List<FAQ> pendingQuestions = faqService.getPendingQuestions();
        return ResponseEntity.ok(pendingQuestions);
    }

    // Admin gets all FAQs (including pending)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FAQ>> getAllFAQsForAdmin() {
        List<FAQ> allFaqs = faqService.getAllFAQsForAdmin();
        return ResponseEntity.ok(allFaqs);
    }

    // Admin answers a question
    @PostMapping("/admin/answer/{faqId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> answerQuestion(
            @RequestHeader("Authorization") String token,
            @PathVariable Long faqId,
            @RequestBody Map<String, Object> payload) {

        // Extract token without "Bearer " prefix
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        User admin = userService.getUserFromToken(jwtToken);
        String answer = (String) payload.get("answer");
        Boolean publish = (Boolean) payload.getOrDefault("publish", false);

        FAQ answeredFaq = faqService.answerQuestion(faqId, answer, admin, publish);
        return ResponseEntity.ok(answeredFaq);
    }

    // Admin creates a new FAQ directly
    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> createFAQ(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, String> payload) {

        // Extract token without "Bearer " prefix
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        User admin = userService.getUserFromToken(jwtToken);
        String question = payload.get("question");
        String answer = payload.get("answer");

        FAQ faq = faqService.createFAQ(question, answer, admin);
        return ResponseEntity.ok(faq);
    }

    // Admin updates an existing FAQ
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FAQ> updateFAQ(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        FAQ faq = faqService.getFAQById(id);
        faq.setQuestion(payload.get("question"));
        faq.setAnswer(payload.get("answer"));

        if (payload.containsKey("status")) {
            faq.setStatus(payload.get("status"));
        }

        return ResponseEntity.ok(faqService.updateFAQ(faq));
    }

    // Admin deletes an FAQ
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFAQ(@PathVariable Long id) {
        faqService.deleteFAQ(id);
        return ResponseEntity.noContent().build();
    }

    // Get a specific FAQ by ID
    @GetMapping("/{id}")
    public ResponseEntity<FAQ> getFAQById(
            @RequestHeader(value = "Authorization", required = false) String token,
            @PathVariable Long id) {

        FAQ faq = faqService.getFAQById(id);

        // If user is authenticated, check if they can view this FAQ
        if (token != null && !token.isEmpty()) {
            // Extract token without "Bearer " prefix
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            User user = userService.getUserFromToken(jwtToken);

            // Students can only see their own questions or published FAQs
            if (user.getRole().getRoleName().equals("STUDENT")) {
                if (!faq.getStatus().equals("PUBLISHED") &&
                    (faq.getSubmittedBy() == null || !faq.getSubmittedBy().getUserId().equals(user.getUserId()))) {
                    return ResponseEntity.status(403).build();
                }
            }
        } else {
            // Public access: only show published FAQs
            if (!faq.getStatus().equals("PUBLISHED")) {
                return ResponseEntity.status(403).build();
            }
        }

        return ResponseEntity.ok(faq);
    }
}
