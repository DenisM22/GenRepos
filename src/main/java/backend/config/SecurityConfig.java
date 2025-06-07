package backend.config;

import backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.http.Rfc6265CookieProcessor;
import org.springframework.boot.web.embedded.tomcat.TomcatContextCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserService userService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOriginPatterns(List.of("*"));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/person/get-all", "/person/get/*", "/document/confessional/get-all",
                                "/document/confessional/get/*", "/document/metric/get-all", "/document/metric/get/*",
                                "/document/revision/get-all", "/document/revision/get/*", "/user/register").permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");
                            new ObjectMapper().writeValue(response.getWriter(), "Вы не авторизованы");
                        })
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/user/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .successHandler((request, response, authentication) -> {
                            response.setStatus(HttpServletResponse.SC_OK);
                            request.getSession().setMaxInactiveInterval(60 * 60 * 24); //Сессия активна 1 день
                        })
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.setCharacterEncoding("UTF-8");

                            String message;
                            if (exception instanceof BadCredentialsException) {
                                message = "Неверное имя пользователя или пароль";
                            } else {
                                message = "Ошибка авторизации: " + exception.getMessage();
                            }

                            new ObjectMapper().writeValue(response.getWriter(), message);
                        })
                        .permitAll()
                )
                .logout(logout -> logout
                        .logoutUrl("/user/logout")
                        .logoutSuccessHandler(
                                (request, response, authentication)
                                        -> response.setStatus(HttpServletResponse.SC_OK))
                        .deleteCookies("JSESSIONID")
                        .invalidateHttpSession(true)
                )
                .userDetailsService(userService);

        return http.build();
    }

    //Куки для деплоя на рендер
//    @Bean
//    public TomcatContextCustomizer sameSiteCookieCustomizer() {
//        return context -> {
//            Rfc6265CookieProcessor cookieProcessor = new Rfc6265CookieProcessor();
//            cookieProcessor.setSameSiteCookies("None");
//            context.setCookieProcessor(cookieProcessor);
//        };
//    }

//    @Bean
//    public CorsFilter corsFilter() {
//        CorsConfiguration configuration = new CorsConfiguration();
//        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
//        configuration.setAllowedMethods(List.of("*"));
//        configuration.setAllowedHeaders(List.of("*"));
//        configuration.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/**", configuration);
//        return new CorsFilter(source);
//    }
//

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
