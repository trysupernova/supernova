package main

import (
	"log"
	"net/http"

	"github.com/trysupernova/supernova-api/db"
	"github.com/trysupernova/supernova-api/supernova_tasks"
	"github.com/trysupernova/supernova-api/utils"

	"github.com/gorilla/mux"
	"github.com/trysupernova/supernova-api/middleware"
	customRouter "github.com/trysupernova/supernova-api/router"
	"github.com/trysupernova/supernova-api/user"
)

func main() {
	//init environments
	utils.InitConfig()
	if utils.GetConfig().ENVIRONMENT == "prod" {
		log.Println("🤖 Running in production mode")
	} else {
		log.Println("🤖 Running in development mode")
	}

	port := utils.GetConfig().PORT
	if port == "" {
		port = "8000"
	}
	router := BuildAppRouter()

	//Setup database
	db.DB = db.SetupDB()
	// close db connection when server shuts down
	sqlDb, _ := db.DB.DB()
	defer sqlDb.Close()

	// setup redis
	db.Redis = db.SetupRedis()
	defer db.Redis.Close()

	//create http server
	log.Println("🤖 Starting server on port " + port)
	http.Handle("/", middleware.CORSMiddleware(router))
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

/*
Builds the router for the application
*/
func BuildAppRouter() *mux.Router {

	//init router
	router := mux.NewRouter()

	// add middlewares
	//append routes
	customRouter.AppRoutes = append(customRouter.AppRoutes, user.Routes, supernova_tasks.Routes)

	for _, route := range customRouter.AppRoutes {

		//create subroute
		routePrefix := router.PathPrefix(route.Prefix).Subrouter()

		//loop through each sub route
		for _, r := range route.SubRoutes {

			var handler http.Handler
			handler = r.HandlerFunc
			handler = middleware.LoggingMiddleware(handler)

			//check to see if route should be protected with jwt
			if r.Protected {
				handler = middleware.JWTMiddleware(handler)
			}

			//attach sub route
			routePrefix.
				Path(r.Pattern).
				Handler(handler).
				Methods(r.Method).
				Name(r.Name)
		}

	}

	return router
}
