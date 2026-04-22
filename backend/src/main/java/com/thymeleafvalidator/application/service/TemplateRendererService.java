package com.thymeleafvalidator.application.service;

import com.thymeleafvalidator.domain.model.RenderResult;
import com.thymeleafvalidator.domain.port.in.RenderTemplateUseCase;
import com.thymeleafvalidator.domain.port.out.TemplateEnginePort;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class TemplateRendererService implements RenderTemplateUseCase {

    private final TemplateEnginePort templateEnginePort;

    public TemplateRendererService(TemplateEnginePort templateEnginePort) {
        this.templateEnginePort = templateEnginePort;
    }

    @Override
    public RenderResult render(String templateContent, Map<String, Object> data) {
        if (templateContent == null || templateContent.isEmpty()) {
             return new RenderResult("", java.util.List.of(
                     new com.thymeleafvalidator.domain.model.TemplateError(1, 1, "Empty template", "Validation")
             ));
        }
        return templateEnginePort.process(templateContent, data);
    }
}
