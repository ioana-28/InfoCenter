package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ChatSessionTest {

    @Test
    void constructor_ShouldSetUser() {
        User user = new User();
        ChatSession session = new ChatSession(user);

        assertEquals(user, session.getUser());
        assertNotNull(session.getStartedAt());
        assertNotNull(session.getLastMessageAt());
    }
}
