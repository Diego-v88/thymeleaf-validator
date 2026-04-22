package com.thymeleafvalidator.application.service;

import com.thymeleafvalidator.domain.model.RenderResult;
import com.thymeleafvalidator.domain.port.out.TemplateEnginePort;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TemplateRendererServiceTest {

    private final TemplateEnginePort templateEnginePort = mock(TemplateEnginePort.class);
    private final TemplateRendererService service = new TemplateRendererService(templateEnginePort);

    @Test
    void testRenderEmptyTemplate() {
        RenderResult result = service.render("", Collections.emptyMap());
        assertEquals("", result.htmlOutput());
        assertEquals(1, result.errors().size());
        assertEquals("Empty template", result.errors().get(0).message());
        
        verifyNoInteractions(templateEnginePort);
    }

    @Test
    void testRenderValidTemplate() {
        String template = "<p th:text=\"${name}\"></p>";
        Map<String, Object> data = Map.of("name", "John");
        RenderResult expectedResult = new RenderResult("<p>John</p>", Collections.emptyList());
        
        when(templateEnginePort.process(template, data)).thenReturn(expectedResult);
        
        RenderResult result = service.render(template, data);
        
        assertEquals("<p>John</p>", result.htmlOutput());
        assertTrue(result.errors().isEmpty());
        
        verify(templateEnginePort).process(template, data);
    }
    
    @Test
    void testRenderMissingVariables() {
        String template = "<p th:text=\"${name}\"></p>";
        Map<String, Object> data = Collections.emptyMap();
        
        when(templateEnginePort.process(template, data)).thenReturn(
            new RenderResult("<p>null</p>", Collections.emptyList())
        );
        
        RenderResult result = service.render(template, data);
        assertEquals("<p>null</p>", result.htmlOutput());
        assertTrue(result.errors().isEmpty());
        
        verify(templateEnginePort).process(template, data);
    }
}
