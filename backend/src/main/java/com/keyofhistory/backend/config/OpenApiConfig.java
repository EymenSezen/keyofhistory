package com.keyofhistory.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger/OpenAPI configuration bean (similar to AddSwaggerGen configuration in Program.cs in .NET)
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Key of History API")
                        .version("1.0.0")
                        .description("Tarihi Olayların yönetildiği ve asenkron istatistiklerin paylaşıldığı RESTful API servisleri.")
                        .contact(new Contact()
                                .name("Eymen Sezen")
                                .url("https://github.com/eymensezeen")));
    }
}
