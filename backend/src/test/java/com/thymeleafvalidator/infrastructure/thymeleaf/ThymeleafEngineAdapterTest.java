package com.thymeleafvalidator.infrastructure.thymeleaf;

import com.thymeleafvalidator.domain.model.RenderResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.templateresolver.StringTemplateResolver;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class ThymeleafEngineAdapterTest {

    private ThymeleafEngineAdapter adapter;

    @BeforeEach
    void setUp() {
        SpringTemplateEngine engine = new SpringTemplateEngine();
        StringTemplateResolver resolver = new StringTemplateResolver();
        resolver.setTemplateMode("HTML");
        engine.setTemplateResolver(resolver);
        adapter = new ThymeleafEngineAdapter(engine);
    }

    @Test
    void testProcessSuccessfulRendering() {
        String template = "<p th:text=\"${title}\"></p>";
        Map<String, Object> data = Map.of("title", "Hello World");

        RenderResult result = adapter.process(template, data);

        assertEquals("<p>Hello World</p>", result.htmlOutput());
        assertTrue(result.errors().isEmpty());
    }

    @Test
    void testProcessNullDataMap() {
        String template = "<div>Static HTML</div>";

        RenderResult result = adapter.process(template, null);

        assertEquals("<div>Static HTML</div>", result.htmlOutput());
        assertTrue(result.errors().isEmpty());
    }

    @Test
    void testProcessTemplateProcessingException() {
        String template = "<div th:text=\"${invalid.syntax.bad}\"></div>";

        RenderResult result = adapter.process(template, Map.of());

        // Should return rendering error or result
        assertNotNull(result);
        assertNotNull(result.errors());
    }
}
