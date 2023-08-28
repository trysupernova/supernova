package db

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// database global
var DB *gorm.DB

/*
 * Returns a database connection URL suitable for use with Atlas
 */
func GetDatabaseUrl() string {
	// set config file for dev environment only
	if os.Getenv("ENVIRONMENT") == "dev" || os.Getenv("ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			panic("Error loading .env file")
		}
	}

	//db config vars
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbPort := os.Getenv("DB_PORT")

	//build connection string
	var dbConnectionString string = fmt.Sprintf("mysql://%s:%s@%s:%s/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	return dbConnectionString
}

/*
 * Returns a database connection DSN suitable for use with GORM
 */
func GetDatabaseDSN() string {
	// set config file for dev environment only
	if os.Getenv("ENVIRONMENT") == "dev" || os.Getenv("ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			panic("Error loading .env file")
		}
	}

	//db config vars
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")
	dbUser := os.Getenv("DB_USERNAME")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbPort := os.Getenv("DB_PORT")

	//build connection string
	var dbConnectionString string = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)

	return dbConnectionString
}

/*
 * Setup database connection and return a pointer to the connection
 */
func SetupDB() *gorm.DB {
	// set config file for dev environment only
	if os.Getenv("ENVIRONMENT") == "dev" || os.Getenv("ENVIRONMENT") == "" {
		err := godotenv.Load(".env")
		if err != nil {
			panic("Error loading .env file")
		}
	}

	//build connection string
	var dbConnectionString string = GetDatabaseDSN()
	//connect to db
	db, dbError := gorm.Open(mysql.Open(dbConnectionString), &gorm.Config{SkipDefaultTransaction: true})
	if dbError != nil {
		panic("Failed to connect to database")
	}

	return db
}
