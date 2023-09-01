package db

import (
	"fmt"

	"github.com/trysupernova/supernova-api/utils"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// database global
var DB *gorm.DB

/*
 * Returns a database connection URL suitable for use with Atlas
 */
func GetDatabaseUrl() string {
	//db config vars
	dbHost := utils.GetConfig().DB_HOST
	dbName := utils.GetConfig().DB_NAME
	dbUser := utils.GetConfig().DB_USERNAME
	dbPassword := utils.GetConfig().DB_PASSWORD
	dbPort := utils.GetConfig().DB_PORT

	//build connection string
	var dbConnectionString string = fmt.Sprintf("mysql://%s:%s@%s:%s/%s", dbUser, dbPassword, dbHost, dbPort, dbName)

	return dbConnectionString
}

/*
 * Returns a database connection DSN suitable for use with GORM
 */
func GetDatabaseDSN() string {
	//db config vars
	dbHost := utils.GetConfig().DB_HOST
	dbName := utils.GetConfig().DB_NAME
	dbUser := utils.GetConfig().DB_USERNAME
	dbPassword := utils.GetConfig().DB_PASSWORD
	dbPort := utils.GetConfig().DB_PORT

	//build connection string
	var dbConnectionString string = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPassword, dbHost, dbPort, dbName)

	return dbConnectionString
}

/*
 * Setup database connection and return a pointer to the connection
 */
func SetupDB() *gorm.DB {
	//build connection string
	dbConnectionString := GetDatabaseDSN()
	//connect to db
	db, dbError := gorm.Open(mysql.Open(dbConnectionString), &gorm.Config{SkipDefaultTransaction: true})
	if dbError != nil {
		panic("Failed to connect to database")
	}

	return db
}
