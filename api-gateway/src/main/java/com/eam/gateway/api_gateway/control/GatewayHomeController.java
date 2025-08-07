package com.eam.gateway.api_gateway.control;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GatewayHomeController {
    @GetMapping("/")
    public String home() {
        return "API Gateway is up! Available routes: /api/user/**, /api/ordreIntervention/**, etc.";
    }
}
