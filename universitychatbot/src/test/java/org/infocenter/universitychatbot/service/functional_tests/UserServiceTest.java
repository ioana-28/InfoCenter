package org.infocenter.universitychatbot.service.functional_tests;

import org.infocenter.universitychatbot.model.Role;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.UserRepository;
import org.infocenter.universitychatbot.service.JwtService;
import org.infocenter.universitychatbot.service.RoleService;
import org.infocenter.universitychatbot.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleService roleService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_ShouldSetFieldsAndEncodePassword() {
        Role role = new Role("STUDENT");
        when(roleService.getRoleByName("STUDENT")).thenReturn(Optional.of(role));
        when(userRepository.findByEmail("user@uni.edu")).thenReturn(Optional.empty());
        when(passwordEncoder.encode("password")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User user = userService.createUser("user@uni.edu", "password", "John Doe", "STUDENT");

        assertEquals("user@uni.edu", user.getEmail());
        assertEquals("hashedPassword", user.getPasswordHash());
        assertEquals("John Doe", user.getFullName());
        assertEquals(role, user.getRole());
        assertNotNull(user.getCreatedAt());
    }

    @Test
    void validatePassword_ShouldReturnTrueForCorrectPassword() {
        when(passwordEncoder.matches("password", "hashed")).thenReturn(true);

        boolean result = userService.validatePassword("password", "hashed");
        assertTrue(result);
    }

    @Test
    void generateToken_ShouldCallJwtService() {
        User user = new User();
        when(jwtService.generateToken(user)).thenReturn("token123");

        String token = userService.generateToken(user);

        assertEquals("token123", token);
    }
}
