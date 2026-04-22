package com.thymeleafvalidator.domain.port.in;

import com.thymeleafvalidator.domain.model.RenderResult;
import java.util.Map;

public interface RenderTemplateUseCase {
    RenderResult render(String templateContent, Map<String, Object> data);
}
