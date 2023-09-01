package middleware

import (
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gorilla/handlers"
	customHTTP "github.com/trysupernova/supernova-api/http"

	"github.com/golang-jwt/jwt/v5"
)

func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.Header.Get("Authorization")
		if len(tokenString) == 0 {
			customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Authentication failure")
			return
		}
		tokenString = strings.Replace(tokenString, "Bearer ", "", 1)
		claims, err := VerifyToken(tokenString)
		if err != nil {
			customHTTP.NewErrorResponse(w, http.StatusUnauthorized, "Error verifying JWT token: "+err.Error())
			return
		}

		//pass userId claim to req
		//todo: find a better way to convert the claim to string
		userId := strconv.FormatFloat(claims.(jwt.MapClaims)["uid"].(float64), 'g', 1, 64)
		r.Header.Set("userId", userId)
		next.ServeHTTP(w, r)
	})
}

func CORSMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		// Check if the request method is OPTIONS (preflight request)
		if r.Method == "OPTIONS" {
			// Respond with HTTP 200 OK for preflight requests
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return handlers.CombinedLoggingHandler(os.Stdout, next)
}
