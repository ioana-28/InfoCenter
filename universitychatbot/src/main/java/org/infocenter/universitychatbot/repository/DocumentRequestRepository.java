package org.infocenter.universitychatbot.repository;


import org.infocenter.universitychatbot.model.DocumentRequest;
import org.infocenter.universitychatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DocumentRequestRepository extends JpaRepository<DocumentRequest, Long> {
    List<DocumentRequest> findByStudent(User student);
    List<DocumentRequest> findByStatus(String status);
}
