package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

func soundsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Query the database to get the list of sound files
		rows, err := db.Query("SELECT id, name, filepath, tags FROM sounds")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Create a slice to hold the results
		var sounds []Sound
		for rows.Next() {
			var s Sound
			if err := rows.Scan(&s.ID, &s.Name, &s.Filepath, &s.Tags); err != nil {
				http.Error(w, "Failed to scan row", http.StatusInternalServerError)
				return
			}
			sounds = append(sounds, s)
		}

		// Check for errors encountered during iteration
		if err := rows.Err(); err != nil {
			http.Error(w, "Failed to iterate over rows", http.StatusInternalServerError)
			return
		}

		// Convert the results to JSON and send them back
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(sounds); err != nil {
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}

// Sound represents a sound file
type Sound struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Filepath string `json:"filepath"`
	Tags     string `json:"tags"`
}