package com.thymeleafvalidator.application.service;

import com.thymeleafvalidator.domain.model.AnalysisResult;
import com.thymeleafvalidator.domain.model.TemplateError;
import com.thymeleafvalidator.domain.model.TemplateVariable;
import com.thymeleafvalidator.domain.port.in.AnalyzeTemplateUseCase;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TemplateAnalyzerService implements AnalyzeTemplateUseCase {

    private static final Pattern VARIABLE_PATTERN = Pattern.compile("\\$\\{([^}]+)\\}");
    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("[a-zA-Z_][a-zA-Z0-9_]*");
    
    private static final Set<String> RESERVED_KEYWORDS = Set.of(
            "and", "or", "not", "eq", "neq", "lt", "gt", "le", "ge", "true", "false", "null", "new", "instanceof", "T", "param", "session", "application", "ctx", "vars", "locale", "request", "response", "lists", "strings", "objects", "bools", "numbers", "dates", "calendars", "arrays", "sets", "maps", "aggregates", "messages", "ids", "execInfo", "httpServletRequest", "httpSession", "empty"
    );

    @Override
    public AnalysisResult analyze(String templateContent) {
        Set<String> variableNames = new HashSet<>();
        List<TemplateError> errors = new ArrayList<>();

        if (templateContent == null || templateContent.trim().isEmpty()) {
            errors.add(new TemplateError(1, 1, "Template is empty", "Validation"));
            return new AnalysisResult(List.of(), errors);
        }

        Matcher matcher = VARIABLE_PATTERN.matcher(templateContent);
        while (matcher.find()) {
            String expression = matcher.group(1);
            
            // Ignore quoted strings to avoid false variables
            String cleanExpression = expression.replaceAll("'[^']*'", " ");
            
            // Ignore Thymeleaf utility objects and their methods e.g. #lists.isEmpty
            cleanExpression = cleanExpression.replaceAll("#[a-zA-Z0-9_.]+", " ");
            
            Matcher idMatcher = IDENTIFIER_PATTERN.matcher(cleanExpression);
            while (idMatcher.find()) {
                String id = idMatcher.group();
                if (!RESERVED_KEYWORDS.contains(id)) {
                    variableNames.add(id);
                }
            }
        }

        List<TemplateVariable> variables = variableNames.stream()
                .map(name -> new TemplateVariable(name, "String", "Detected variable"))
                .toList();

        // Basic syntax error detection
        long openCount = templateContent.chars().filter(ch -> ch == '{').count();
        long closeCount = templateContent.chars().filter(ch -> ch == '}').count();
        if (openCount != closeCount) {
             errors.add(new TemplateError(1, 1, "Mismatched braces {} found in the template.", "Syntax"));
        }

        return new AnalysisResult(variables, errors);
    }
}
