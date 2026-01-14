package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.repository.ChatMessageRepository;
import org.infocenter.universitychatbot.repository.ChatSessionRepository;
import org.infocenter.universitychatbot.repository.UserRepository;
import org.infocenter.universitychatbot.service.ChatService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class ChatServiceConstructorTest {

    @Mock
    private ChatSessionRepository chatSessionRepository;
    @Mock
    private ChatMessageRepository chatMessageRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RestTemplate restTemplate;

    @Test
    void constructor_ShouldInitializeChatService() {
        ChatService chatService = new ChatService(chatSessionRepository, chatMessageRepository, userRepository, restTemplate);
        assertNotNull(chatService);
    }
}

