package com.thymeleafvalidator.domain.port.out;

import com.thymeleafvalidator.domain.model.RenderResult;
import java.util.Map;

public interface TemplateEnginePort {
    RenderResult process(String templateContent, Map<String, Object> data);
}
