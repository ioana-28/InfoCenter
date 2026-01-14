package org.infocenter.universitychatbot.service;

import org.infocenter.universitychatbot.model.Role;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, RoleService roleService,
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User createUser(String email, String password, String fullName, String roleName) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        Role role = roleService.getRoleByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role " + roleName + " not found"));

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password)); // hashed password
        user.setFullName(fullName);
        user.setRole(role);
        user.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));

        return userRepository.save(user);
    }

    public boolean validatePassword(String rawPassword, String hash) {
        return passwordEncoder.matches(rawPassword, hash);
    }

    public String generateToken(User user) {
        return jwtService.generateToken(user);
    }

    public User getUserFromToken(String token) {
        String email = jwtService.getEmailFromToken(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Convenience method to extract user from Authorization header
    public User getUserFromAuthHeader(String authHeader) {
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        return getUserFromToken(token);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllStudents() {
        return userRepository.findByRole_RoleName("STUDENT");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUserByEmail(String email) {

        if (userRepository.findByEmail(email).isPresent()) {
            userRepository.deleteByEmail(email);
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
