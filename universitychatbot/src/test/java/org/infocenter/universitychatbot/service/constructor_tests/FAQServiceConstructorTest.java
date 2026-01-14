package org.infocenter.universitychatbot.service.constructor_tests;

import org.infocenter.universitychatbot.repository.FAQRepository;
import org.infocenter.universitychatbot.service.FAQService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class FAQServiceConstructorTest {

    @Mock
    private FAQRepository faqRepository;

    @Test
    void constructor_ShouldInitializeFAQService() {
        FAQService faqService = new FAQService(faqRepository);
        assertNotNull(faqService);
    }
}

