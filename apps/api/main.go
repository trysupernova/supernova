package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/trysupernova/supernova-api/db"
	"github.com/trysupernova/supernova-api/supernova_tasks"

	"github.com/gorilla/mux"
	"github.com/trysupernova/supernova-api/middleware"
	customRouter "github.com/trysupernova/supernova-api/router"
	"github.com/trysupernova/supernova-api/user"
)

func main() {
	//init router
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}
	router := BuildAppRouter()

	//Setup database
	db.DB = db.SetupDB()
	// close db connection when server shuts down
	sqlDb, _ := db.DB.DB()
	defer sqlDb.Close()

	//create http server
	log.Println("🤖 Starting server on port " + port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

/*
Builds the router for the application
*/
func BuildAppRouter() *mux.Router {

	//init router
	router := mux.NewRouter()

	// add middlewares
	router.Use(middleware.CORSMiddleware)
	router.Use(middleware.LoggingMiddleware)

	//append user routes
	customRouter.AppRoutes = append(customRouter.AppRoutes, user.Routes, supernova_tasks.Routes)

	for _, route := range customRouter.AppRoutes {

		//create subroute
		routePrefix := router.PathPrefix(route.Prefix).Subrouter()

		//loop through each sub route
		for _, r := range route.SubRoutes {

			var handler http.Handler
			handler = r.HandlerFunc

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
