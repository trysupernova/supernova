package db

import (
	"os"

	"github.com/redis/go-redis/v9"
)

var Redis *redis.Client

func SetupRedis() *redis.Client {
	Redis = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})
	return Redis
}
