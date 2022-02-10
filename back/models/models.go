package models

import (
	"database/sql"
	"time"
)

// Models is the wrapper for database
type Models struct {
	DB DBModel
}

// NewModels returns models with db pool
func NewModels(db *sql.DB) Models {
	return Models{
		DB: DBModel{DB: db},
	}
}

type School struct {
	ID           int            `json:"id"`
	Name         string         `json:"name"`
	Recruit_type string         `json:"recruit_type"`
	Salary       string         `json:"salary"`
	Description  string         `json:"description"`
	CreatedAt    time.Time      `json:"-"`
	UpdatedAt    time.Time      `json:"-"`
	SchoolGenre  map[int]string `json:"genres"`
}
type Genre struct {
	ID        int       `json:"id"`
	GenreName string    `json:"genre_name"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type SchoolGenre struct {
	ID        int       `json:"-"`
	SchoolID  int       `json:"-"`
	GenreID   int       `json:"-"`
	Genre     Genre     `json:"genre"`
	CreatedAt time.Time `json:"-"`
	UpdatedAt time.Time `json:"-"`
}

type User struct {
	ID       int
	Email    string
	Password string
}
