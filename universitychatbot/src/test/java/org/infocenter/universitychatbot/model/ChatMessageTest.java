package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;
import java.sql.Timestamp;

import static org.junit.jupiter.api.Assertions.*;

class ChatMessageTest {

    @Test
    void constructor_ShouldInitializeFields() {
        ChatSession session = new ChatSession();
        String sender = "STUDENT";
        String messageText = "Hello";

        ChatMessage message = new ChatMessage(session, sender, messageText);

        assertEquals(session, message.getSession());
        assertEquals(sender, message.getSender());
        assertEquals(messageText, message.getMessageText());
        assertNotNull(message.getSentAt());
    }
}
