package org.infocenter.universitychatbot.controller;

import org.infocenter.universitychatbot.model.DocumentRequest;
import org.infocenter.universitychatbot.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/admin/requests")
public class AdminRequestController {

    private final DocumentService documentService;

    public AdminRequestController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping
    public ResponseEntity<List<DocumentRequest>> getAllRequests() {
        return ResponseEntity.ok(documentService.getAllRequests());
    }

    @PutMapping("/{id}")
    public ResponseEntity<DocumentRequest> updateRequest(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminReason) {
        DocumentRequest request = documentService.getRequestById(id);
        if (status.equalsIgnoreCase("APPROVED")) {
            return ResponseEntity.ok(documentService.approveRequest(request, adminReason));
        } else if (status.equalsIgnoreCase("REJECTED")) {
            return ResponseEntity.ok(documentService.rejectRequest(request, adminReason));
        }
        throw new RuntimeException("Invalid status");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {

        documentService.deleteRequest(id);
        return ResponseEntity.noContent().build();
    }
}
