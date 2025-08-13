package com.eam.odoo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class OdooIntegrationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OdooIntegrationServiceApplication.class, args);
    }
}