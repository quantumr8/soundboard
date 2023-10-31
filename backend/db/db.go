package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func Init() {
	// Get database connection credentials from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPass := os.Getenv("DB_PASS")
	dbHost := os.Getenv("DB_HOST")
	dbName := os.Getenv("DB_NAME")

	// Create database connection string
	connStr := fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", dbUser, dbPass, dbHost, dbName)

	// Connect to database
	var err error
	db, err = sql.Open("mysql", connStr)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	// defer db.Close()

	// Ensure the database is reachable
	if err := db.Ping(); err != nil {
		log.Fatalf("Error pinging database: %v", err)
	}
	log.Println("Connected to database successfully.")
}

func GetDB() *sql.DB {
	return db
}