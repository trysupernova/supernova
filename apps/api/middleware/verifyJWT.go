package middleware

import (
	"os"

	"github.com/golang-jwt/jwt/v5"
)

/*
Verify JWT token based on environment var (JWT_SECRET)
*/

func VerifyToken(tokenString string) (jwt.Claims, error) {
	signingKey := []byte(os.Getenv("JWT_SECRET"))
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return signingKey, nil
	})
	if err != nil {
		return nil, err
	}
	return token.Claims, err
}
