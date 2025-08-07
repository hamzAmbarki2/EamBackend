package com.eam.gateway.api_gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@SpringBootApplication
@EnableDiscoveryClient
public class ApiGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiGatewayApplication.class, args);
	}

	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("user-service", r -> r.path("/api/user/**", "/api/auth/**")
						.uri("lb://user-service"))
				.route("asset-service", r -> r.path("/api/machine/**")
						.uri("lb://asset-service"))
				.route("work-order-service", r -> r.path("/api/ordreTravail/**")
						.uri("lb://work-order-service"))
				.route("intervention-service", r -> r.path("/api/ordreIntervention/**")
						.uri("lb://intervention-service"))
				.route("planning-service", r -> r.path("/api/planning/**")
						.uri("lb://planning-service"))
				.route("document-service", r -> r.path("/api/archives/**", "/api/rapports/**")
						.uri("lb://document-service"))
				.route("activity-log-service", r -> r.path("/api/activities/**")
						.uri("lb://activity-log-service"))
				.route("notification-service", r -> r.path("/api/notifications/**")
						.uri("lb://notification-service"))
				.route("dashboard-service", r -> r.path("/api/dashboard/**", "/api/admin/dashboard/**")
						.uri("lb://dashboard-service"))
				.route("admin-service", r -> r.path("/api/admin/**")
						.uri("lb://admin-service"))
				.route("search-service", r -> r.path("/api/search/**")
						.uri("lb://search-service"))
				.build();
	}

	@Bean
	public CorsWebFilter corsWebFilter() {
		CorsConfiguration corsConfig = new CorsConfiguration();
		corsConfig.setAllowCredentials(true);
		corsConfig.setAllowedOriginPatterns(Arrays.asList("http://localhost:8080"));
		corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
		corsConfig.setAllowedHeaders(Arrays.asList("*"));
		corsConfig.setExposedHeaders(Arrays.asList("Authorization"));

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", corsConfig);

		return new CorsWebFilter(source);
	}
}