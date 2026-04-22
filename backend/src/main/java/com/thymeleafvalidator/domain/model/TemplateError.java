package com.thymeleafvalidator.domain.model;

public record TemplateError(
        Integer line,
        Integer col,
        String message,
        String errorType
) {
}
