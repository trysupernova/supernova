package http

import (
	"encoding/json"
	"log"
	"net/http"
)

type ErrorResponse struct {
	Error      bool   `json:"error"`
	Message    string `json:"message"`
	StatusCode int    `json:"statusCode"`
}

type SuccessResponse[T any] struct {
	Message    string `json:"message"`
	StatusCode int    `json:"statusCode"`
	Data       T      `json:"data,omitempty"`
}

/*
HTTP Response handling for errors,
Returns valid JSON with error type and response code
*/
func NewErrorResponse(w http.ResponseWriter, statusCode int, response string) {
	error := ErrorResponse{
		true,
		response,
		statusCode,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(&error)
	if err != nil {
		log.Println("Error sending encoded JSON response: ", err)
		return
	}
}

/*
HTTP Response handling for success,
Returns valid JSON with success type and response code
*/
func NewSuccessResponse[T any](w http.ResponseWriter, statusCode int, resp SuccessResponse[T]) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(&resp)
	if err != nil {
		log.Println("Error sending encoded JSON response: ", err)
		return
	}
}

/*
Parse JSON body from request
*/
func ParseBodyJSON(r *http.Request, v interface{}) error {
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&v)
	if err != nil {
		return err
	}
	return nil
}
