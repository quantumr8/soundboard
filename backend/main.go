package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

func main() {
	// Get database connection credentials from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")

	// Create database connection string
	connStr := dbUser + ":" + dbPass + "@tcp(" + dbHost + ")/" + dbName

	// Connect to database
	db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal("Error connecting to database: ", err)
	}
	defer db.Close()

	// Ensure the database is reachable
	if err := db.Ping(); err != nil {
		log.Fatal("Error pinging database: ", err)
	}
	log.Println("Connected to database successfully.")

	// Create a new Gorilla Mux router
	r := mux.NewRouter()

	// Set up routes
	r.HandleFunc("/upload", uploadHandler(db)).Methods("POST")
	r.HandleFunc("/sounds", soundsHandler(db)).Methods("GET")
	r.HandleFunc("/metadata", metadataHandler(db)).Methods("GET", "POST")
	r.HandleFunc("/sound/{id:[0-9]+}", getSoundHandler(db)).Methods("GET")

	// Serve static files from the frontend build directory
	r.PathPrefix("/").Handler(http.FileServer(http.Dir("../frontend/build/")))

	// Start the server
	log.Println("Server started on :8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}

func uploadHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implement file upload logic here
	}
}

func soundsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implement logic to retrieve sound files here
	}
}

func metadataHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implement logic to manage metadata here
	}
}

func getSoundHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Implement logic to retrieve a specific sound file here
	}
}
