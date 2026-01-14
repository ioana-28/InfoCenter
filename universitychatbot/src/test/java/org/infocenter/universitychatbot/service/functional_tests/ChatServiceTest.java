package org.infocenter.universitychatbot.service.functional_tests;

import org.infocenter.universitychatbot.model.ChatMessage;
import org.infocenter.universitychatbot.model.ChatSession;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.ChatMessageRepository;
import org.infocenter.universitychatbot.repository.ChatSessionRepository;
import org.infocenter.universitychatbot.repository.UserRepository;
import org.infocenter.universitychatbot.service.ChatService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)
class ChatServiceTest {

    @Mock
    private ChatSessionRepository chatSessionRepository;
    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private ChatService chatService;

    @Test
    void generateBotReply_ShouldReturnEchoMessage() {
        ChatSession session = new ChatSession();
        session.setUser(new User());
        String userMessage = "Hello";

        // Mock chatMessageRepository.save
        when(chatMessageRepository.save(any(ChatMessage.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ChatMessage reply = chatService.generateBotReply(session, userMessage);

        assertEquals("BOT", reply.getSender());
        assertEquals("Echo: Hello", reply.getMessageText());
    }

    @Test
    void sendMessage_ShouldSetMessageFields() {
        ChatSession session = new ChatSession();
        session.setUser(new User());

        when(chatMessageRepository.save(any(ChatMessage.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(chatSessionRepository.save(any(ChatSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ChatMessage message = chatService.sendMessage(session, "STUDENT", "Hi bot");

        assertEquals("STUDENT", message.getSender());
        assertEquals("Hi bot", message.getMessageText());
        assertEquals(session, message.getSession());
    }

    @Test
    void renameSession_ShouldUpdateTitle() {
        User user = new User();
        user.setUserId(1L);
        ChatSession session = new ChatSession();
        session.setSessionId(10L);
        session.setUser(user);

        when(chatSessionRepository.findById(10L)).thenReturn(java.util.Optional.of(session));
        when(chatSessionRepository.save(any(ChatSession.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ChatSession updated = chatService.renameSession(10L, "New Title", user);

        assertEquals("New Title", updated.getTitle());
    }
}
