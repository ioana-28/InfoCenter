package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class RoleTest {

    @Test
    void constructor_ShouldSetRoleName() {
        Role role = new Role("ADMIN");
        assertEquals("ADMIN", role.getRoleName());
    }

    @Test
    void noArgConstructor_ShouldCreateEmptyObject() {
        Role role = new Role();
        assertNotNull(role);
        assertNull(role.getRoleName());
    }
}
