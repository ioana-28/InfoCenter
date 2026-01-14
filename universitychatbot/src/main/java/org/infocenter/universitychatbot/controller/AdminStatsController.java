package org.infocenter.universitychatbot.controller;

import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.model.ChatSession;
import org.infocenter.universitychatbot.model.ChatMessage;
import org.infocenter.universitychatbot.service.DocumentService;
import org.infocenter.universitychatbot.service.UserService;
import org.infocenter.universitychatbot.service.ChatService;
import org.infocenter.universitychatbot.service.FAQService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final UserService userService;
    private final DocumentService documentService;
    private final ChatService chatService;
    private final FAQService faqService;

    public AdminStatsController(UserService userService, DocumentService documentService, ChatService chatService, FAQService faqService) {
        this.userService = userService;
        this.documentService = documentService;
        this.chatService = chatService;
        this.faqService = faqService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPendingRequests", documentService.getPendingRequests().size());
        stats.put("totalActiveStudents", userService.getAllStudents().size());
        stats.put("totalChatSessionsToday", chatService.getTodaySessions().size());
        stats.put("totalPendingQuestions", faqService.getPendingQuestionsCount());
        return ResponseEntity.ok(stats);
    }

    // Get all students for user management
    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    // Get all users (students and admins) for user management
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        return ResponseEntity.ok(allUsers);
    }

    @DeleteMapping("/users/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String email) {
        userService.getUserByEmail(email).ifPresent(user -> {
            chatService.deleteUserSessions(user);
            documentService.deleteRequestsByStudent(user);
            userService.deleteUserByEmail(email);
        });
        return ResponseEntity.noContent().build();
    }

    // Get chat sessions for a specific user
    @GetMapping("/users/{userId}/sessions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChatSession>> getUserSessions(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        List<ChatSession> sessions = chatService.getUserSessions(user);
        return ResponseEntity.ok(sessions);
    }

    // Get messages for a specific session
    @GetMapping("/sessions/{sessionId}/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChatMessage>> getSessionMessages(@PathVariable Long sessionId) {
        ChatSession session = chatService.getSessionById(sessionId);
        List<ChatMessage> messages = chatService.getMessages(session);
        return ResponseEntity.ok(messages);
    }
}