package org.infocenter.universitychatbot.service;

import org.infocenter.universitychatbot.model.DocumentRequest;
import org.infocenter.universitychatbot.model.UniversityDocument;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.DocumentRequestRepository;
import org.infocenter.universitychatbot.repository.UniversityDocumentRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRequestRepository requestRepository;
    private final UniversityDocumentRepository documentRepository;

    public DocumentService(DocumentRequestRepository requestRepository, UniversityDocumentRepository documentRepository) {
        this.requestRepository = requestRepository;
        this.documentRepository = documentRepository;
    }

    public DocumentRequest requestDocument(User student, String documentType, String details) {
        DocumentRequest request = new DocumentRequest();
        request.setStudent(student);
        request.setDocumentType(documentType);
        request.setStatus("PENDING");
        request.setDetails(details);
        return requestRepository.save(request);
    }

    public List<DocumentRequest> getRequestsByStudent(User student) {
        return requestRepository.findByStudent(student);
    }

    public DocumentRequest getRequestById(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document request not found"));
    }

    public DocumentRequest approveRequest(DocumentRequest request, String reason) {
        request.setStatus("APPROVED");
        request.setAdminReason(reason);
        request.setAdminResponseDate(new Timestamp(System.currentTimeMillis()));
        return requestRepository.save(request);
    }

    public DocumentRequest rejectRequest(DocumentRequest request, String reason) {
        request.setStatus("REJECTED");
        request.setAdminReason(reason);
        request.setAdminResponseDate(new Timestamp(System.currentTimeMillis()));
        return requestRepository.save(request);
    }

    public List<DocumentRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<DocumentRequest> getPendingRequests() {
        return requestRepository.findByStatus("PENDING");
    }

    public UniversityDocument uploadDocument(String title, String fileUrl, User admin) {
        UniversityDocument doc = new UniversityDocument();
        doc.setTitle(title);
        doc.setFileUrl(fileUrl);
        doc.setUploadedBy(admin);
        return documentRepository.save(doc);
    }

    public List<UniversityDocument> getAllDocuments() {
        return documentRepository.findAll();
    }

    public void deleteDocument(Long id) {
        UniversityDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        documentRepository.delete(doc);
        // Optional: delete file from storage if you implement file upload
    }


    public void deleteRequest(Long id) {
        DocumentRequest request = getRequestById(id); // Reuse your existing method to find the request

        // Optional: Uncomment this block if you want to prevent deleting 'PENDING' requests

        if (!"APPROVED".equalsIgnoreCase(request.getStatus()) && !"REJECTED".equalsIgnoreCase(request.getStatus())) {
             throw new RuntimeException("Only processed (Approved or Rejected) requests can be deleted.");
        }

        requestRepository.delete(request);
    }

    public void deleteRequestsByStudent(User student) {
        List<DocumentRequest> requests = requestRepository.findByStudent(student);
        requestRepository.deleteAll(requests);
    }


}