package org.isfce.pid.test;

import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration
public class TestCacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("commandes", "commandesBySession", "commandesBySessionAndDate");
    }
}
