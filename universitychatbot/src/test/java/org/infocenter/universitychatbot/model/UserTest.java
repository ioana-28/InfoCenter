package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void constructor_ShouldInitializeFields() {
        Role role = new Role("STUDENT");

        User user = new User(
                "student@e-uvt.ro",
                "hashedPassword",
                "John Doe",
                role
        );

        assertEquals("student@e-uvt.ro", user.getEmail());
        assertEquals("hashedPassword", user.getPasswordHash());
        assertEquals("John Doe", user.getFullName());
        assertEquals(role, user.getRole());
        assertNotNull(user.getCreatedAt());
    }


    @Test
    void noArgConstructor_ShouldCreateEmptyObject() {
        User user = new User();
        assertNotNull(user);
        assertNull(user.getEmail());
        assertNotNull(user.getCreatedAt());
    }
}
