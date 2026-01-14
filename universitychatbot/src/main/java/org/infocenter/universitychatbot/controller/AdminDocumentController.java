package org.infocenter.universitychatbot.controller;

import org.infocenter.universitychatbot.model.UniversityDocument;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.service.DocumentService;
import org.infocenter.universitychatbot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class AdminDocumentController {

    private final DocumentService documentService;
    private final UserService userService;

    public AdminDocumentController(DocumentService documentService, UserService userService) {
        this.documentService = documentService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UniversityDocument>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @PostMapping("/upload")
    public ResponseEntity<UniversityDocument> uploadDocument(
            @RequestParam String title,
            @RequestParam String fileUrl,
            @RequestParam String adminEmail) {
        User admin = userService.getUserByEmail(adminEmail).orElseThrow(() -> new RuntimeException("Admin not found"));
        return ResponseEntity.ok(documentService.uploadDocument(title, fileUrl, admin));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }
}
