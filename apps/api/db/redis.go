package db

import (
	"github.com/redis/go-redis/v9"
	"github.com/trysupernova/supernova-api/utils"
)

var Redis *redis.Client

func SetupRedis() *redis.Client {
	Redis = redis.NewClient(&redis.Options{
		Addr:     utils.GetConfig().REDIS_URL,
		Password: utils.GetConfig().REDIS_PASSWORD,
		DB:       0,
	})
	return Redis
}
