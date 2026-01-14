package org.infocenter.universitychatbot.service.functional_tests;

import org.infocenter.universitychatbot.model.DocumentRequest;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.DocumentRequestRepository;
import org.infocenter.universitychatbot.repository.UniversityDocumentRepository;
import org.infocenter.universitychatbot.service.DocumentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DocumentServiceTest {

    @Mock
    private DocumentRequestRepository requestRepository;
    @Mock
    private UniversityDocumentRepository documentRepository;

    @InjectMocks
    private DocumentService documentService;

    @Test
    void requestDocument_ShouldSetFieldsAndReturn() {
        User student = new User();
        DocumentRequest request = new DocumentRequest();
        when(requestRepository.save(any(DocumentRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DocumentRequest saved = documentService.requestDocument(student, "Transcript", "Need official transcript");

        assertEquals(student, saved.getStudent());
        assertEquals("Transcript", saved.getDocumentType());
        assertEquals("PENDING", saved.getStatus());
        assertEquals("Need official transcript", saved.getDetails());
    }

    @Test
    void approveRequest_ShouldSetStatusAndTimestamp() {
        DocumentRequest request = new DocumentRequest();
        when(requestRepository.save(any(DocumentRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DocumentRequest approved = documentService.approveRequest(request, "Verified by admin");

        assertEquals("APPROVED", approved.getStatus());
        assertEquals("Verified by admin", approved.getAdminReason());
        assertNotNull(approved.getAdminResponseDate());
    }

    @Test
    void rejectRequest_ShouldSetStatusAndTimestamp() {
        DocumentRequest request = new DocumentRequest();
        when(requestRepository.save(any(DocumentRequest.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        DocumentRequest rejected = documentService.rejectRequest(request, "Incorrect document type");

        assertEquals("REJECTED", rejected.getStatus());
        assertEquals("Incorrect document type", rejected.getAdminReason());
        assertNotNull(rejected.getAdminResponseDate());
    }
}
