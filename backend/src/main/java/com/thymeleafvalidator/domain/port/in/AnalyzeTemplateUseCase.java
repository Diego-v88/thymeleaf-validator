package com.thymeleafvalidator.domain.port.in;

import com.thymeleafvalidator.domain.model.AnalysisResult;

public interface AnalyzeTemplateUseCase {
    AnalysisResult analyze(String templateContent);
}
