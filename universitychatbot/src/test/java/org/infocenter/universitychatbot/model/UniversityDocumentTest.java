package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UniversityDocumentTest {

    @Test
    void constructor_ShouldInitializeFields() {
        User admin = new User();
        UniversityDocument doc =
                new UniversityDocument("Rules", "http://docs/rules.pdf", admin);

        assertEquals("Rules", doc.getTitle());
        assertEquals("http://docs/rules.pdf", doc.getFileUrl());
        assertEquals(admin, doc.getUploadedBy());
        assertNotNull(doc.getUploadedAt());
    }
}
