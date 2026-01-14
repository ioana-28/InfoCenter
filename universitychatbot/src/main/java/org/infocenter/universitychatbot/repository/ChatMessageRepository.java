package org.infocenter.universitychatbot.repository;

import org.infocenter.universitychatbot.model.ChatMessage;
import org.infocenter.universitychatbot.model.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionOrderBySentAtAsc(ChatSession session);
}
