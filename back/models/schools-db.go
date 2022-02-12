package models

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"
)

type DBModel struct {
	DB *sql.DB
}

func (m *DBModel) Get(id int) (*School, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, name, recruit_type, salary, description,
				created_at, updated_at from schools where id = $1`
	row := m.DB.QueryRowContext(ctx, query, id)

	var school School

	err := row.Scan(
		&school.ID,
		&school.Name,
		&school.Recruit_type,
		&school.Salary,
		&school.Description,
		&school.CreatedAt,
		&school.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	query = `select 
				mg.id, mg.school_id, mg.genre_id, g.genre_name
			from
				schools_genres mg
				left join genres g on (g.id = mg.genre_id)
			where
				mg.school_id = $1
	`
	rows, _ := m.DB.QueryContext(ctx, query, id)
	defer rows.Close()

	genres := make(map[int]string)
	for rows.Next() {
		var mg SchoolGenre
		err := rows.Scan(
			&mg.ID,
			&mg.SchoolID,
			&mg.GenreID,
			&mg.Genre.GenreName,
		)
		if err != nil {
			return nil, err
		}
		genres[mg.ID] = mg.Genre.GenreName
	}

	school.SchoolGenre = genres

	return &school, nil
}

func (m *DBModel) All(genre ...int) ([]*School, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	where := ""
	if len(genre) > 0 {
		where = fmt.Sprintf("where id in (select school_id from schools_genres where genre_id = %d )", genre[0])
	}
	query := fmt.Sprintf(`select id, name, recruit_type, salary, description,
				created_at, updated_at from schools %s order by name`, where)

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	var schools []*School

	for rows.Next() {
		var school School
		err := rows.Scan(
			&school.ID,
			&school.Name,
			&school.Recruit_type,
			&school.Salary,
			&school.Description,
			&school.CreatedAt,
			&school.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		genreQuery := `select 
				mg.id, mg.school_id, mg.genre_id, g.genre_name
			from
				schools_genres mg
				left join genres g on (g.id = mg.genre_id)
			where
				mg.school_id = $1
	`
		genreRows, _ := m.DB.QueryContext(ctx, genreQuery, school.ID)

		genres := make(map[int]string)
		for genreRows.Next() {
			var mg SchoolGenre
			err := genreRows.Scan(
				&mg.ID,
				&mg.SchoolID,
				&mg.GenreID,
				&mg.Genre.GenreName,
			)
			if err != nil {
				return nil, err
			}
			genres[mg.ID] = mg.Genre.GenreName
		}
		genreRows.Close()
		school.SchoolGenre = genres
		schools = append(schools, &school)

	}
	return schools, nil
}

func (m *DBModel) GenreAll() ([]*Genre, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	query := `select id, genre_name, created_at, updated_at from genres order by genre_name`

	rows, err := m.DB.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var genres []*Genre
	for rows.Next() {
		var genre Genre
		err := rows.Scan(
			&genre.ID,
			&genre.GenreName,
			&genre.CreatedAt,
			&genre.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		genres = append(genres, &genre)
	}
	return genres, nil
}

func (m *DBModel) InsertSchool(school School) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	stmt := `insert into schools (name, recruit_type, salary, description,
		created_at, updated_at) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
	_, err := m.DB.ExecContext(ctx, stmt,
		school.ID,
		school.Name,
		school.Recruit_type,
		school.Salary,
		school.Description,
		school.CreatedAt,
		school.UpdatedAt,
	)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (m *DBModel) UpdateSchool(school School) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	stmt := `update  schools set name = $1, recruit_type = $2, salary = $3, description = $4, 
				updated_at = $5 where id = $6`
	_, err := m.DB.ExecContext(ctx, stmt,
		school.Name,
		school.Recruit_type,
		school.Salary,
		school.Description,
		school.CreatedAt,
		school.UpdatedAt,
		school.ID,
	)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func (m *DBModel) DeleteSchool(id int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	stmt := "delete from schools where id = $1"
	_, err := m.DB.ExecContext(ctx, stmt, id)

	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
