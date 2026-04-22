package com.thymeleafvalidator.infrastructure.rest.dto;

import java.util.Map;

public record TemplateRequest(
        String template,
        Map<String, Object> data
) {
}
