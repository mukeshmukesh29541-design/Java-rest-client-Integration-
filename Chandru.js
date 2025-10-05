package com.example.restclient;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@SpringBootApplication
public class RestClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestClientApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ApiService apiService) {
        return args -> {
            System.out.println("===== GET REQUEST =====");
            apiService.getData().subscribe(response -> {
                System.out.println("Response: " + response);
            });

            System.out.println("===== POST REQUEST =====");
            ApiRequest request = new ApiRequest("ChatGPT", "Integration Test");
            apiService.postData(request).subscribe(response -> {
                System.out.println("Response: " + response);
            });
        };
    }
}

@Service
class ApiService {

    private final WebClient webClient;

    public ApiService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://jsonplaceholder.typicode.com")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public Mono<String> getData() {
        return webClient.get()
                .uri("/posts/1")
                .retrieve()
                .bodyToMono(String.class);
    }

    public Mono<String> postData(ApiRequest request) {
        return webClient.post()
                .uri("/posts")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class);
    }
}

class ApiRequest {
    private String title;
    private String body;

    public ApiRequest() {}

    public ApiRequest(String title, String body) {
        this.title = title;
        this.body = body;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }
}