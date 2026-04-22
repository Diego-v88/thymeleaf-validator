package com.thymeleafvalidator.infrastructure.rest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.thymeleafvalidator.infrastructure.rest.dto.TemplateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TemplateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAnalyzeEndpoint() throws Exception {
        TemplateRequest req = new TemplateRequest("<p>${name}</p>", null);
        
        mockMvc.perform(post("/api/template/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variables[0].name").value("name"));
    }

    @Test
    void testRenderEndpoint() throws Exception {
        TemplateRequest req = new TemplateRequest("<p th:text=\"${name}\"></p>", Map.of("name", "Diego"));
        
        mockMvc.perform(post("/api/template/render")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.htmlOutput").value("<p>Diego</p>"));
    }

    @Test
    void testAnalyzeComplexEndpoint() throws Exception {
        TemplateRequest req = new TemplateRequest("<div th:if=\"${status == 'ERROR' and user != null}\"></div>", null);
        
        mockMvc.perform(post("/api/template/analyze")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.variables.length()").value(2))
                .andExpect(jsonPath("$.variables[?(@.name == 'status')]").exists())
                .andExpect(jsonPath("$.variables[?(@.name == 'user')]").exists())
                .andExpect(jsonPath("$.variables[?(@.name == 'ERROR')]").doesNotExist());
    }
}
