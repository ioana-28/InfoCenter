package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.service.JwtService;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

class JwtServiceConstructorTest {

    @Test
    void constructor_ShouldInitializeJwtService() {
        JwtService jwtService = new JwtService();
        assertNotNull(jwtService);
    }
}

