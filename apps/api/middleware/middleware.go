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
		//allow all origins
		w.Header().Set("Access-Control-Allow-Origin", "*")
		//allow all headers
		w.Header().Set("Access-Control-Allow-Headers", "*")
		//allow all methods
		w.Header().Set("Access-Control-Allow-Methods", "*")
		next.ServeHTTP(w, r)
	})
}

func LoggingMiddleware(next http.Handler) http.Handler {
	return handlers.CombinedLoggingHandler(os.Stdout, next)
}
