package utils

import (
	"fmt"
)

type AppErrorType string

type AppError struct {
	Type    AppErrorType `json:"type"`
	Message string       `json:"message"`
}

func (e *AppError) Error() string {
	return fmt.Sprintf("%s: %s", e.Type, e.Message)
}

func NewAppError(errType AppErrorType, message string) *AppError {
	return &AppError{
		Type:    errType,
		Message: message,
	}
}
