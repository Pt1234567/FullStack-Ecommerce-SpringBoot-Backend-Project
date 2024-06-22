package com.prash.ecommerce.config;

import com.okta.spring.boot.oauth.Okta;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.accept.ContentNegotiationStrategy;
import org.springframework.web.accept.HeaderContentNegotiationStrategy;



@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {

        //protect endpoints /api/orders
        httpSecurity.authorizeHttpRequests(requests->
                requests
                        .requestMatchers("/api/orders/**")
                        .authenticated().anyRequest().permitAll())
                .oauth2ResourceServer(oauth2ResourceServer->
                        oauth2ResourceServer.jwt(Customizer.withDefaults()));


        httpSecurity.cors(Customizer.withDefaults());

        httpSecurity.setSharedObject(ContentNegotiationStrategy.class,new HeaderContentNegotiationStrategy());

        Okta.configureResourceServer401ResponseBody(httpSecurity);

        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }
}
