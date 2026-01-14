package org.infocenter.universitychatbot.repository;

import org.infocenter.universitychatbot.model.FAQ;
import org.infocenter.universitychatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FAQRepository extends JpaRepository<FAQ, Long> {

    // Find FAQs by status
    List<FAQ> findByStatusOrderByCreatedAtAsc(String status);

    // Find FAQs submitted by a specific student
    List<FAQ> findBySubmittedByOrderByCreatedAtDesc(User submittedBy);

    // Find published FAQs (for public viewing)
    List<FAQ> findByStatusOrderByCreatedAtDesc(String status);

    // Count pending questions
    long countByStatus(String status);
}

