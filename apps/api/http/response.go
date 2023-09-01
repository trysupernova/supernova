package http

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/trysupernova/supernova-api/utils"
)

var customLogErr = log.New(os.Stderr, "[Error]: ", log.LstdFlags)

type ErrorResponse struct {
	Error      bool               `json:"error"`
	Message    string             `json:"message"`
	StatusCode int                `json:"statusCode"`
	ErrorCode  utils.AppErrorType `json:"errorCode,omitempty"`
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
func NewErrorResponse(w http.ResponseWriter, statusCode int, appErr error) {
	error := ErrorResponse{
		Error:      true,
		Message:    appErr.Error(),
		StatusCode: statusCode,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	err := json.NewEncoder(w).Encode(&error)
	if err != nil {
		customLogErr.Println("Error sending encoded JSON response: ", err)
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
		customLogErr.Println("Error sending encoded JSON response: ", err)
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
