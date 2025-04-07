package org.isfce.pid.config;

import java.util.Arrays;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

	// Récupère l'URI du jeu de clés (JWK Set) depuis le fichier de configuration
	@Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
	private String keySetUri;

	// Instance du convertisseur JWT vers le contexte de sécurité
	private final KeycloakJwtConverter converter;

	// Constructeur qui injecte le convertisseur JWT dans la configuration
	public SecurityConfig(KeycloakJwtConverter converter) {
		super();
		this.converter = converter;
	}

	@Bean
	@Profile("dev")
	WebSecurityCustomizer webSecurityCustomizer() {
		// Ignore les requêtes vers la console H2 en mode développement
		return (web) -> web.ignoring().requestMatchers("/h2/**");
	}

	// Configuration de la chaîne de filtres de sécurité
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		// Configure la gestion de session en mode stateless (sans session)
		http.sessionManagement(t -> t.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		// Désactive la protection CSRF
		http.csrf(c -> c.disable());
		// Configure le CORS avec la source définie dans corsConfigurationSource()
		http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				// Configure le serveur de ressources OAuth2
				.oauth2ResourceServer(
					//Version en utilisant le certificat en local
					//c -> c.jwt(j->j.jwtAuthenticationConverter(converter))); 
					//Version où le certificat est recherché sur Keycloak
					c-> c.jwt(j ->j.jwkSetUri(keySetUri).jwtAuthenticationConverter(converter)));
		// Définit les règles d'autorisation des requêtes HTTP
		http.authorizeHttpRequests(
				c -> c.requestMatchers("/api/garniture/**").hasAnyRole("USER","CAFET")
				.requestMatchers("/api/sandwichs/**").hasAnyRole("USER", "CAFET")
				.requestMatchers(HttpMethod.POST, "/api/user/incsolde/**").hasAnyRole("CAFET", "ADMIN")
				.anyRequest().authenticated());

		return http.build();
	}

	// Configuration des règles CORS
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList("*"));
		configuration.setAllowedMethods(Arrays.asList("*"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setExposedHeaders(Arrays.asList("*"));
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

}