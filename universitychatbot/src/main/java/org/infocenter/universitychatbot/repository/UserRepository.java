package org.infocenter.universitychatbot.repository;

import org.infocenter.universitychatbot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole_RoleName(String roleName);

    @Transactional
    void deleteByEmail(String email);
}
