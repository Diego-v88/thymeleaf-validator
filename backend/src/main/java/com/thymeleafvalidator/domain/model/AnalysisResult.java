package com.thymeleafvalidator.domain.model;

import java.util.List;

public record AnalysisResult(
        List<TemplateVariable> variables,
        List<TemplateError> errors
) {
}
