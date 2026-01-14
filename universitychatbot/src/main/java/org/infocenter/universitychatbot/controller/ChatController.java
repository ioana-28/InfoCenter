package org.infocenter.universitychatbot.controller;

import org.infocenter.universitychatbot.model.ChatMessage;
import org.infocenter.universitychatbot.model.ChatSession;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.service.ChatService;
import org.infocenter.universitychatbot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    public ChatController(ChatService chatService, UserService userService) {
        this.chatService = chatService;
        this.userService = userService;
    }

    @PostMapping("/start")
    public ResponseEntity<ChatSession> startSession(@RequestParam String email) {
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        ChatSession session = chatService.startSession(user);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/conversations")
    public ResponseEntity<ChatSession> createConversation(@RequestBody(required = false) Map<String, String> payload, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        String title = payload != null ? payload.get("title") : null;
        ChatSession session = chatService.createSession(user, title);
        return ResponseEntity.ok(session);
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ChatSession>> getUserConversations(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(chatService.getUserSessions(user));
    }

    @DeleteMapping("/conversations/{conversationId}")
    public ResponseEntity<Void> deleteConversation(@PathVariable Long conversationId, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        chatService.deleteSession(conversationId, user);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/conversations/{conversationId}")
    public ResponseEntity<ChatSession> renameConversation(
            @PathVariable Long conversationId,
            @RequestBody Map<String, String> payload,
            Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        String newTitle = payload.get("title");
        if (newTitle == null || newTitle.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        ChatSession updatedSession = chatService.renameSession(conversationId, newTitle, user);
        return ResponseEntity.ok(updatedSession);
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<ChatMessage>> getConversationMessages(@PathVariable Long conversationId, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        ChatSession session = chatService.getSessionById(conversationId);
        if (!session.getUser().getUserId().equals(user.getUserId()) && !user.getRole().getRoleName().equals("ADMIN")) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(chatService.getMessages(session));
    }

    @GetMapping("/admin/users/{userId}/conversations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ChatSession>> getStudentConversations(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(chatService.getUserSessions(user));
    }

//    @PostMapping("/{sessionId}/message")
//    public ResponseEntity<ChatMessage> sendMessage(
//            @PathVariable Long sessionId,
//            @RequestParam String message) {
//        ChatSession session = chatService.getSessionById(sessionId);
//        ChatMessage userMsg = chatService.sendMessage(session, "STUDENT", message);
//        ChatMessage botMsg = chatService.generateBotReply(session, message); // Implement bot logic
//        return ResponseEntity.ok(botMsg);
//    }

    @GetMapping("/{sessionId}/history")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable Long sessionId) {
        ChatSession session = chatService.getSessionById(sessionId);
        return ResponseEntity.ok(chatService.getMessages(session));
    }

    @PostMapping("/ask-ai")
    public ResponseEntity<Map<String, Object>> askAi(@RequestBody Map<String, Object> payload, Authentication authentication) {
        String message = (String) payload.get("message");
        Object sessionIdObj = payload.get("sessionId");

        ChatSession session;

        if (sessionIdObj != null) {
            Long sessionId = Long.valueOf(sessionIdObj.toString());
            session = chatService.getSessionById(sessionId);
        } else {
            String email = authentication.getName();
            User user = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            session = chatService.createSession(user, message.length() > 20 ? message.substring(0, 20) + "..." : message);
        }

        // Save user message
        chatService.sendMessage(session, "STUDENT", message);

        // Get AI response
        String aiResponse = chatService.getAiResponse(message);

        // Save AI response
        chatService.sendMessage(session, "BOT", aiResponse);

        return ResponseEntity.ok(Map.of(
                "output", aiResponse,
                "sessionId", session.getSessionId()
        ));
    }
}
