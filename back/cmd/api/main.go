package main

import (
	"back/models"
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

const version = "1.0.0"

type config struct {
	port string
	env  string
	db   struct {
		dsn string
	}
	jwt struct {
		secret string
	}
}

type AppStatus struct {
	Status      string `json:"status"`
	Environment string `json:"environment"`
	Version     string `json:"version"`
}

type application struct {
	config config
	logger *log.Logger
	models models.Models
}

func main() {
	logger := log.New(os.Stdout, "", log.Ldate|log.Ltime)

	err := godotenv.Load()
	if err != nil {
		logger.Fatal(err)
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000" // Default port if not specified
	}
	var cfg config
	flag.StringVar(&cfg.port, "port", port, "Server port to listen")
	flag.StringVar(&cfg.env, "env", "development", "Application environment (development|production)")
	flag.StringVar(&cfg.db.dsn, "dsn", os.Getenv("DATABASE_URL"), "Postgres connection string")
	flag.StringVar(&cfg.jwt.secret, "jwt-secret", os.Getenv("JWT_SECRET"), "secret")
	flag.Parse()

	db, err := openDB(cfg)

	if err != nil {
		logger.Fatal(err)
	}
	defer db.Close()

	app := &application{
		config: cfg,
		logger: logger,
		models: models.NewModels(db),
	}
	srv := &http.Server{
		Addr:        fmt.Sprintf(":%v", cfg.port),
		Handler:     app.routes(),
		IdleTimeout: time.Minute,
		ReadTimeout: 10 * time.Second,
	}
	logger.Println("Starting server on port", cfg.port)

	err = srv.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

func openDB(cfg config) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.db.dsn)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = db.PingContext(ctx)

	if err != nil {
		return nil, err
	}
	return db, nil
}
