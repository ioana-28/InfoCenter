package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class DocumentRequestTest {

    @Test
    void constructor_ShouldInitializeFields() {
        User student = new User();
        String documentType = "Transcript";
        String status = "PENDING";
        String details = "Official transcript";

        DocumentRequest request =
                new DocumentRequest(student, documentType, status, details);

        assertEquals(student, request.getStudent());
        assertEquals(documentType, request.getDocumentType());
        assertEquals(status, request.getStatus());
        assertEquals(details, request.getDetails());
        assertNotNull(request.getRequestedAt());
    }

    @Test
    void noArgConstructor_ShouldCreateEmptyObject() {
        DocumentRequest request = new DocumentRequest();
        assertNotNull(request);
        assertNull(request.getDocumentType());
        assertNotNull(request.getRequestedAt()); // Assuming initialized inline
    }
}
