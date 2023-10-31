package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
)

func uploadHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Only allow POST requests
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		// TODO: Handle file upload here


		fmt.Fprint(w, "File uploaded successfully")
	}
}