package com.thymeleafvalidator.domain.model;

public record TemplateVariable(
        String name,
        String type,
        String description
) {
}
