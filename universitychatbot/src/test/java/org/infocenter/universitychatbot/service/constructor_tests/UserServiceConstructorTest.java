package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.repository.UserRepository;
import org.infocenter.universitychatbot.service.JwtService;
import org.infocenter.universitychatbot.service.RoleService;
import org.infocenter.universitychatbot.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class UserServiceConstructorTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleService roleService;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;

    @Test
    void constructor_ShouldInitializeUserService() {
        UserService userService = new UserService(userRepository, roleService, passwordEncoder, jwtService);
        assertNotNull(userService);
    }
}

