package org.infocenter.universitychatbot.service.functional_tests;

import org.infocenter.universitychatbot.model.FAQ;
import org.infocenter.universitychatbot.model.User;
import org.infocenter.universitychatbot.repository.FAQRepository;
import org.infocenter.universitychatbot.service.FAQService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FAQServiceTest {

    @Mock
    private FAQRepository faqRepository;

    @InjectMocks
    private FAQService faqService;

    @Test
    void submitQuestion_ShouldSetStudentAndPendingStatus() {
        User student = new User();
        when(faqRepository.save(any(FAQ.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FAQ faq = faqService.submitQuestion("When is enrollment?", student);

        assertEquals("When is enrollment?", faq.getQuestion());
        assertEquals(student, faq.getSubmittedBy());
        assertEquals("PENDING", faq.getStatus());
        assertNotNull(faq.getCreatedAt());
    }

    @Test
    void createFAQ_ShouldSetAdminAndPublishedStatus() {
        User admin = new User();
        when(faqRepository.save(any(FAQ.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        FAQ faq = faqService.createFAQ("Office hours?", "9-17", admin);

        assertEquals("Office hours?", faq.getQuestion());
        assertEquals("9-17", faq.getAnswer());
        assertEquals(admin, faq.getUploadedBy());
        assertEquals("PUBLISHED", faq.getStatus());
        assertNotNull(faq.getCreatedAt());
    }

    @Test
    void answerQuestion_ShouldSetAnswerAndStatus() {
        User admin = new User();
        FAQ faq = new FAQ("Library hours?", new User());
        faq.setStatus("PENDING");

        when(faqRepository.findById(anyLong())).thenReturn(java.util.Optional.of(faq));
        when(faqRepository.save(any(FAQ.class))).thenAnswer(invocation -> invocation.getArgument(0));

        FAQ answered = faqService.answerQuestion(1L, "8-20", admin, true);

        assertEquals("8-20", answered.getAnswer());
        assertEquals(admin, answered.getUploadedBy());
        assertEquals("PUBLISHED", answered.getStatus());
        assertNotNull(answered.getAnsweredAt());
    }
}
