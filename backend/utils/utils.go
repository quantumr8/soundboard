package main

import (
	"encoding/json"
	"net/http"
)

// RespondWithJSON is a utility function to encode data into JSON and write it to the response
func RespondWithJSON(w http.ResponseWriter, statusCode int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	if data != nil {
		json.NewEncoder(w).Encode(data)
	}
}

// RespondWithError is a utility function to send an error response with a given status code and message
func RespondWithError(w http.ResponseWriter, statusCode int, message string) {
	RespondWithJSON(w, statusCode, map[string]string{"error": message})
}

// HandleError is a utility function to log an error and send an error response
func HandleError(w http.ResponseWriter, err error, statusCode int) {
	// Log the error (in a real-world application, you might want to log to a file or an external service)
	log.Printf("Error: %v", err)
	RespondWithError(w, statusCode, "Internal Server Error")
}

// GetEnv retrieves environment variables, with a default fallback value
func GetEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}