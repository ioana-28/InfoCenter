package org.infocenter.universitychatbot.service;

import org.infocenter.universitychatbot.model.ChatMessage;
import org.infocenter.universitychatbot.model.ChatSession;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.ChatMessageRepository;
import org.infocenter.universitychatbot.repository.ChatSessionRepository;
import org.infocenter.universitychatbot.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChatService {

    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public ChatService(ChatSessionRepository chatSessionRepository, ChatMessageRepository chatMessageRepository, UserRepository userRepository, RestTemplate restTemplate) {
        this.chatSessionRepository = chatSessionRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    public ChatSession startSession(User user) {
        return createSession(user, null);
    }

    public ChatSession createSession(User user, String title) {
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setTitle(title != null && !title.isEmpty() ? title : "New Conversation");
        return chatSessionRepository.save(session);
    }

    public ChatSession getSessionById(Long id) {
        return chatSessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chat session not found"));
    }

    public ChatMessage sendMessage(ChatSession session, String sender, String messageText) {
        ChatMessage message = new ChatMessage();
        message.setSession(session);
        message.setSender(sender);
        message.setMessageText(messageText);

        session.setLastMessageAt(new java.sql.Timestamp(System.currentTimeMillis()));
        chatSessionRepository.save(session);

        return chatMessageRepository.save(message);
    }

    public ChatMessage generateBotReply(ChatSession session, String userMessage) {
        // Placeholder bot logic; you can replace with document/FAQ search
        return sendMessage(session, "BOT", "Echo: " + userMessage);
    }

    public List<ChatMessage> getMessages(ChatSession session) {
        return chatMessageRepository.findBySessionOrderBySentAtAsc(session);
    }

    public List<ChatSession> getUserSessions(User user) {
        return chatSessionRepository.findByUser(user);
    }

    public void deleteSession(Long sessionId, User user) {
        ChatSession session = getSessionById(sessionId);
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access to session");
        }
        chatSessionRepository.delete(session);
    }

    public ChatSession renameSession(Long sessionId, String newTitle, User user) {
        ChatSession session = getSessionById(sessionId);
        if (!session.getUser().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized access to session");
        }
        session.setTitle(newTitle);
        return chatSessionRepository.save(session);
    }

    public List<ChatSession> getTodaySessions() {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        return chatSessionRepository.findByStartedAtBetween(
                java.sql.Timestamp.valueOf(today.atStartOfDay()),
                java.sql.Timestamp.valueOf(today.plusDays(1).atStartOfDay())
        );
    }

    public User getUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null); // returns null if user not found
    }

    public String getAiResponse(String message) {
        String url = "https://n8n-service-scmr.onrender.com/webhook/message";
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("message", message);

        try {
            Map response = restTemplate.postForObject(url, requestBody, Map.class);
            if (response != null && response.containsKey("output")) {
                return response.get("output").toString();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "Sorry, I couldn't get a response from the AI.";
    }

    public void deleteUserSessions(User user) {
        List<ChatSession> sessions = chatSessionRepository.findByUser(user);
        for (ChatSession session : sessions) {
            chatMessageRepository.deleteAll(chatMessageRepository.findBySessionOrderBySentAtAsc(session));
            chatSessionRepository.delete(session);
        }
    }
}
