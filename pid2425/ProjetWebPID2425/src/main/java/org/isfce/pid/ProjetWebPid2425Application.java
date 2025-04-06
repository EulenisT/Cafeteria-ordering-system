package org.isfce.pid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableCaching
public class ProjetWebPid2425Application {
	public static void main(String[] args) {
		SpringApplication.run(ProjetWebPid2425Application.class, args);
	}
}

