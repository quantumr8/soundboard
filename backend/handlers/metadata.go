package handlers

import (
	"database/sql"
	"net/http"
)

func MetadataHandler(db *sql.DB) https.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
			case "GET":
				// TODO: Implement logic to retrieve metadata here
			case "POST":
				// TODO: Implement logic to update metadata here
			default:
				http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		}
	}
}