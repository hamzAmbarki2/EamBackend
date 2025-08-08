package com.eam.asset;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@EnableDiscoveryClient
@ComponentScan(basePackages = {"com.eam.asset", "com.eam.common"})
public class AssetServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AssetServiceApplication.class, args);
    }
}

