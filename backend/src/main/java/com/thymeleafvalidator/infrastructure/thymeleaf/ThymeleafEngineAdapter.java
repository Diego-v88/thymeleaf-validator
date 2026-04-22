package com.thymeleafvalidator.infrastructure.thymeleaf;

import com.thymeleafvalidator.domain.model.RenderResult;
import com.thymeleafvalidator.domain.model.TemplateError;
import com.thymeleafvalidator.domain.port.out.TemplateEnginePort;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.exceptions.TemplateProcessingException;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.List;
import java.util.Map;

@Component
public class ThymeleafEngineAdapter implements TemplateEnginePort {

    private final SpringTemplateEngine stringTemplateEngine;

    public ThymeleafEngineAdapter(SpringTemplateEngine stringTemplateEngine) {
        this.stringTemplateEngine = stringTemplateEngine;
    }

    @Override
    public RenderResult process(String templateContent, Map<String, Object> data) {
        Context context = new Context();
        if (data != null) {
            context.setVariables(data);
        }

        try {
            String resultHtml = stringTemplateEngine.process(templateContent, context);
            return new RenderResult(resultHtml, List.of());
        } catch (TemplateProcessingException e) {
            TemplateError error = new TemplateError(
                    e.getLine(),
                    e.getCol(),
                    e.getMessage(),
                    "Rendering"
            );
            return new RenderResult("", List.of(error));
        } catch (Exception e) {
            TemplateError error = new TemplateError(null, null, e.getMessage(), "System");
            return new RenderResult("", List.of(error));
        }
    }
}
