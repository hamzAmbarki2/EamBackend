package com.eam.document;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.eam.document", "com.eam.common"})
public class DocumentServiceApplication {
	public static void main(String[] args) {
		SpringApplication.run(DocumentServiceApplication.class, args);
	}
}
