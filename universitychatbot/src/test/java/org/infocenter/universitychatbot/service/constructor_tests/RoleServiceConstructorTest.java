package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.repository.RoleRepository;
import org.infocenter.universitychatbot.service.RoleService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class RoleServiceConstructorTest {

    @Mock
    private RoleRepository roleRepository;

    @Test
    void constructor_ShouldInitializeRoleService() {
        RoleService roleService = new RoleService(roleRepository);
        assertNotNull(roleService);
    }
}

