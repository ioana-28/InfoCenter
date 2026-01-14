package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.repository.DocumentRequestRepository;
import org.infocenter.universitychatbot.repository.UniversityDocumentRepository;
import org.infocenter.universitychatbot.service.DocumentService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class DocumentServiceConstructorTest {

    @Mock
    private DocumentRequestRepository requestRepository;
    @Mock
    private UniversityDocumentRepository documentRepository;

    @Test
    void constructor_ShouldInitializeDocumentService() {
        DocumentService documentService = new DocumentService(requestRepository, documentRepository);
        assertNotNull(documentService);
    }
}

