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
    void testAnalyzeNullTemplate() {
        AnalysisResult result = service.analyze(null);
        assertTrue(result.variables().isEmpty());
        assertEquals(1, result.errors().size());
        assertEquals("Template is empty", result.errors().get(0).message());
    }

    @Test
    void testAnalyzeWhitespaceTemplate() {
        AnalysisResult result = service.analyze("   \n\t  ");
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
        
        assertEquals(2, result.variables().size());
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("estado")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("otras_polizas")));
        
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("and")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("null")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("ERROR")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("lists")));
    }

    @Test
    void testAnalyzeUtilityObjectsAndKeywords() {
        String template = "<span th:text=\"${#strings.concat(user.firstName, ' ', user.lastName)}\"></span>" +
                          "<div th:if=\"${#dates.createNow() != null and param.id != null}\"></div>";
        AnalysisResult result = service.analyze(template);

        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("user")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("firstName")));
        assertTrue(result.variables().stream().anyMatch(v -> v.name().equals("lastName")));
        
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("strings")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("dates")));
        assertFalse(result.variables().stream().anyMatch(v -> v.name().equals("param")));
    }

    @Test
    void testMismatchedBraces() {
        String template = "<p>${user.name</p>";
        AnalysisResult result = service.analyze(template);
        assertFalse(result.errors().isEmpty());
        assertTrue(result.errors().stream().anyMatch(e -> e.errorType().equals("Syntax")));
    }
}
