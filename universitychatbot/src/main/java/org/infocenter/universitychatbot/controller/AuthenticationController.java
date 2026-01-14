package org.infocenter.universitychatbot.controller;

import jakarta.validation.Valid;
import org.infocenter.universitychatbot.model.Role;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.service.RoleService;
import org.infocenter.universitychatbot.service.UserService;
import org.infocenter.universitychatbot.dto.UserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final UserService userService;
    private final RoleService roleService;

    public AuthenticationController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody UserDto dto) {
        Role role = roleService.getRoleByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Role not found"));
        User user = userService.createUser(
                dto.getEmail(),
                dto.getPassword(),
                dto.getFullName(),
                role.getRoleName()
        );
        return ResponseEntity.ok(user);
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        User user = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!userService.validatePassword(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        String token = userService.generateToken(user);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().getRoleName()
        ));
    }


    @GetMapping("/users/me")
    public ResponseEntity<User> getCurrentUser(@RequestHeader("Authorization") String token) {
        // Extract token without "Bearer " prefix
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        User user = userService.getUserFromToken(jwtToken);
        return ResponseEntity.ok(user);
    }
}
