package com.thymeleafvalidator.infrastructure.rest;

import com.thymeleafvalidator.domain.model.AnalysisResult;
import com.thymeleafvalidator.domain.model.RenderResult;
import com.thymeleafvalidator.domain.port.in.AnalyzeTemplateUseCase;
import com.thymeleafvalidator.domain.port.in.RenderTemplateUseCase;
import com.thymeleafvalidator.infrastructure.rest.dto.TemplateRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/template")
@CrossOrigin(origins = "*") // For development with Vite
public class TemplateController {

    private final AnalyzeTemplateUseCase analyzeTemplateUseCase;
    private final RenderTemplateUseCase renderTemplateUseCase;

    public TemplateController(AnalyzeTemplateUseCase analyzeTemplateUseCase,
                              RenderTemplateUseCase renderTemplateUseCase) {
        this.analyzeTemplateUseCase = analyzeTemplateUseCase;
        this.renderTemplateUseCase = renderTemplateUseCase;
    }

    @PostMapping("/analyze")
    public ResponseEntity<AnalysisResult> analyze(@RequestBody TemplateRequest request) {
        return ResponseEntity.ok(analyzeTemplateUseCase.analyze(request.template()));
    }

    @PostMapping("/render")
    public ResponseEntity<RenderResult> render(@RequestBody TemplateRequest request) {
        return ResponseEntity.ok(renderTemplateUseCase.render(request.template(), request.data()));
    }
}
