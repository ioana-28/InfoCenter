package org.infocenter.universitychatbot.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class FAQTest {

    @Test
    void constructor_AdminAnswer_ShouldSetAnsweredStatus() {
        User admin = new User();
        FAQ faq = new FAQ("What are office hours?", "9-17", admin);

        assertEquals("What are office hours?", faq.getQuestion());
        assertEquals("9-17", faq.getAnswer());
        assertEquals(admin, faq.getUploadedBy());
        assertEquals("ANSWERED", faq.getStatus());
        assertNotNull(faq.getCreatedAt());
    }

    @Test
    void constructor_StudentQuestion_ShouldSetPendingStatus() {
        User student = new User();
        FAQ faq = new FAQ("When is enrollment?", student);

        assertEquals("When is enrollment?", faq.getQuestion());
        assertEquals(student, faq.getSubmittedBy());
        assertEquals("PENDING", faq.getStatus());
        assertNotNull(faq.getCreatedAt());
    }

    @Test
    void noArgConstructor_ShouldCreateEmptyObject() {
        FAQ faq = new FAQ();
        assertNotNull(faq);
        assertNull(faq.getQuestion());
        assertNotNull(faq.getCreatedAt()); // Assuming initialized inline
    }
}
