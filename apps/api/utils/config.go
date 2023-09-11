package utils

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	PORT                 string
	DB_HOST              string
	DB_NAME              string
	DB_USERNAME          string
	DB_PASSWORD          string
	DB_PORT              string
	JWT_SECRET           string
	RESEND_API_KEY       string
	BASE_URL_WEB_APP     string
	REDIS_URL            string
	REDIS_PASSWORD       string
	ENVIRONMENT          string
	THIS_URL             string // the API's own URL (for OAuth redirects)
	GOOGLE_CLIENT_ID     string
	GOOGLE_CLIENT_SECRET string
}

var config *Config

func InitConfig() {
	//init router
	if os.Getenv("ENVIRONMENT") == "dev" || os.Getenv("ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	}

	config = &Config{
		PORT:                 os.Getenv("PORT"),
		DB_HOST:              os.Getenv("DB_HOST"),
		DB_NAME:              os.Getenv("DB_NAME"),
		DB_USERNAME:          os.Getenv("DB_USERNAME"),
		DB_PASSWORD:          os.Getenv("DB_PASSWORD"),
		DB_PORT:              os.Getenv("DB_PORT"),
		JWT_SECRET:           os.Getenv("JWT_SECRET"),
		RESEND_API_KEY:       os.Getenv("RESEND_API_KEY"),
		BASE_URL_WEB_APP:     os.Getenv("BASE_URL_WEB_APP"),
		REDIS_URL:            os.Getenv("REDIS_URL"),
		REDIS_PASSWORD:       os.Getenv("REDIS_PASSWORD"),
		ENVIRONMENT:          os.Getenv("ENVIRONMENT"),
		THIS_URL:             os.Getenv("THIS_URL"),
		GOOGLE_CLIENT_ID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GOOGLE_CLIENT_SECRET: os.Getenv("GOOGLE_CLIENT_SECRET"),
	}
}

func GetConfig() *Config {
	return config
}
