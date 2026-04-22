package com.thymeleafvalidator.application.service;

import com.thymeleafvalidator.domain.model.AnalysisResult;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TemplateAnalyzerServiceTest {

    private final TemplateAnalyzerService service = new TemplateAnalyzerService();

    @Test
    void testAnalyzeEmptyTemplate() {
        AnalysisResult result = service.analyze("");
        assertTrue(result.variables().isEmpty());
        assertEquals(1, result.errors().size());
        assertEquals("Template is empty", result.errors().get(0).message());
    }

    @Test
    void testAnalyzeSimpleVariables() {
        String template = "<p th:text=\"${user.name}\"></p> <span>${greeting}</span>";
        AnalysisResult result = service.analyze(template);
        
        assertEquals(3, result.variables().size());
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("user")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("name")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("greeting")));
        assertTrue(result.errors().isEmpty());
    }

    @Test
    void testAnalyzeComplexExpression() {
        String template = "<div th:if=\"${estado == 'ERROR' and otras_polizas != null and !#lists.isEmpty(otras_polizas)}\"></div>";
        AnalysisResult result = service.analyze(template);
        
        // Assert it only extracts 'estado' and 'otras_polizas'
        assertEquals(2, result.variables().size());
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("estado")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("otras_polizas")));
        
        // It shouldn't contain keywords like 'and', 'null', 'ERROR' (since it was in strings), or lists (since it was #lists)
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("and")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("null")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("ERROR")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("lists")));
    }

    @Test
    void testMismatchedBraces() {
        String template = "<p>${user.name</p>";
        AnalysisResult result = service.analyze(template);
        assertFalse(result.errors().isEmpty());
        assertTrue(result.errors().stream().anyMatch(e -> e.errorType().equals("Syntax")));
    }
}
