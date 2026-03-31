package com.application.controller;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.application.model.AIInsightsRequest;
import com.application.model.AIInsightsResponse;
import com.application.service.AIInsightsService;

@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "http://localhost:4200")
public class AIInsightsController
{
    @Autowired
    private AIInsightsService aiInsightsService;

    @GetMapping("/health")
    public Map<String, String> health()
    {
        return Collections.singletonMap("status", "AI insights service ready");
    }

    @PostMapping("/insights")
    public AIInsightsResponse generateInsights(@RequestBody AIInsightsRequest request)
    {
        return aiInsightsService.generateInsights(request);
    }
}
