package com.thymeleafvalidator.domain.model;

import java.util.List;

public record RenderResult(
        String htmlOutput,
        List<TemplateError> errors
) {
}
