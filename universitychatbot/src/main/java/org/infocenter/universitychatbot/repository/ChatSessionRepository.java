package org.infocenter.universitychatbot.repository;


import org.infocenter.universitychatbot.model.ChatSession;
import org.infocenter.universitychatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.security.Timestamp;
import java.util.List;

public interface ChatSessionRepository extends JpaRepository<ChatSession, Long> {
    List<ChatSession> findByUser(User user);

    List<ChatSession> findByStartedAtBetween(java.sql.Timestamp timestamp, java.sql.Timestamp timestamp1);
}
