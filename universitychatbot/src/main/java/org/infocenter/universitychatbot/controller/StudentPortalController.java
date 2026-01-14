package org.infocenter.universitychatbot.controller;


import org.infocenter.universitychatbot.model.DocumentRequest;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.service.DocumentService;
import org.infocenter.universitychatbot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/student")

public class StudentPortalController {

    private final DocumentService documentService;
    private final UserService userService;

    public StudentPortalController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }

    @PostMapping("/requests")
    public ResponseEntity<DocumentRequest> createRequest(
            @RequestParam String email,
            @RequestParam String documentType,
            @RequestParam(required = false) String details) {

        User student = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        DocumentRequest request = documentService.requestDocument(student, documentType, details);

        return ResponseEntity.ok(request);
    }


    @GetMapping("/history")
    public ResponseEntity<List<DocumentRequest>> getHistory(@RequestParam String email) {
        User student = userService.getUserByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(documentService.getRequestsByStudent(student));
    }
}
