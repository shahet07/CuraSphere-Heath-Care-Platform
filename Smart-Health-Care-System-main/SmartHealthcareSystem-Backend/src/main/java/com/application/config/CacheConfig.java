package com.application.config;

import java.time.Duration;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

@Configuration
public class CacheConfig {

    @Bean
    public CacheManager cacheManager(
            @Value("${app.redis.enabled:false}") boolean redisEnabled,
            @Value("${app.redis.cache.ttl-minutes:15}") long ttlMinutes,
            ObjectProvider<RedisConnectionFactory> redisConnectionFactoryProvider) {

        RedisConnectionFactory redisConnectionFactory = redisConnectionFactoryProvider.getIfAvailable();

        if (redisEnabled && redisConnectionFactory != null) {
            RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(ttlMinutes))
                    .disableCachingNullValues()
                    .serializeValuesWith(RedisSerializationContext.SerializationPair
                            .fromSerializer(new GenericJackson2JsonRedisSerializer()));

            return RedisCacheManager.builder(redisConnectionFactory)
                    .cacheDefaults(configuration)
                    .transactionAware()
                    .build();
        }

        return new ConcurrentMapCacheManager(
                "doctorCatalog",
                "slotCatalog",
                "slotCatalogByEmail");
    }
}
