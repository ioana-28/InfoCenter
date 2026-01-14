package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.service.JwtAuthenticationFilter;
import org.infocenter.universitychatbot.service.JwtService;
import org.infocenter.universitychatbot.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterConstructorTest {

    @Mock
    private JwtService jwtService;
    @Mock
    private UserService userService;

    @Test
    void constructor_ShouldInitializeJwtAuthenticationFilter() {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtService, userService);
        assertNotNull(filter);
    }
}

