package main

import (
	"back/models"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"github.com/graphql-go/graphql"
)

var schools []*models.School

// graphql schema definition
var fields = graphql.Fields{
	"school": &graphql.Field{
		Type:        schoolType,
		Description: "Get school by id",
		Args: graphql.FieldConfigArgument{
			"id": &graphql.ArgumentConfig{
				Type: graphql.Int,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			id, ok := p.Args["id"].(int)
			if ok {
				for _, school := range schools {
					if school.ID == id {
						return school, nil
					}
				}
			}
			return nil, nil
		},
	},
	"list": &graphql.Field{
		Type:        graphql.NewList(schoolType),
		Description: "Get all schools",
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			return schools, nil
		},
	},
	"search": &graphql.Field{
		Type:        graphql.NewList(schoolType),
		Description: "Search schools by title",
		Args: graphql.FieldConfigArgument{
			"nameContains": &graphql.ArgumentConfig{
				Type: graphql.String,
			},
		},
		Resolve: func(p graphql.ResolveParams) (interface{}, error) {
			var theList []*models.School
			search, ok := p.Args["nameContains"].(string)
			if ok {
				for _, currentSchool := range schools {
					if strings.Contains(strings.ToLower(currentSchool.Name), search) {
						log.Println("Found one")
						theList = append(theList, currentSchool)
					}
				}
			}
			return theList, nil
		},
	},
}

var schoolType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "School",
		Fields: graphql.Fields{
			"id": &graphql.Field{
				Type: graphql.Int,
			},
			"name": &graphql.Field{
				Type: graphql.String,
			},
			"recruit_type": &graphql.Field{
				Type: graphql.String,
			},
			"salary": &graphql.Field{
				Type: graphql.String,
			},
			"description": &graphql.Field{
				Type: graphql.String,
			},
			"created_at": &graphql.Field{
				Type: graphql.DateTime,
			},
			"updated_at": &graphql.Field{
				Type: graphql.DateTime,
			},
		},
	},
)

func (app *application) schoolsGraphQL(w http.ResponseWriter, r *http.Request) {
	schools, _ = app.models.DB.All()
	q, _ := io.ReadAll(r.Body)
	query := string(q)

	log.Println(query)

	rootQuery := graphql.ObjectConfig{Name: "RootQuery", Fields: fields}
	schemaConfig := graphql.SchemaConfig{Query: graphql.NewObject(rootQuery)}
	schema, err := graphql.NewSchema(schemaConfig)
	if err != nil {
		app.errorJSON(w, errors.New("failed to create schema"))
	}
	params := graphql.Params{Schema: schema, RequestString: query}
	resp := graphql.Do(params)
	if len(resp.Errors) > 0 {
		app.errorJSON(w, fmt.Errorf("failed: %+v", resp.Errors))
	}

	j, _ := json.MarshalIndent(resp, "", "  ")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(j)
}
