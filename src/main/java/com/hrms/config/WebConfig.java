package com.hrms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "https://dhruvbaruah.github.io",
                    "http://localhost:8086",
                    "http://localhost:3000",
                    "http://localhost:5000",
                    "http://localhost:5501",
                    "http://127.0.0.1:5000",
                    "http://127.0.0.1:3000",
                    "http://127.0.0.1:8086",
                    "http://127.0.0.1:5501",
                    "http://localhost:63342" // IntelliJ IDEA built-in server
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type")
                .allowCredentials(true)
                .maxAge(3600);
    }
} 