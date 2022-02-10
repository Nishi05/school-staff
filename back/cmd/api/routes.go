package main

import (
	"context"
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/justinas/alice"
)

func (app *application) wrap(next http.Handler) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		ctx := context.WithValue(r.Context(), httprouter.ParamsKey, ps)
		next.ServeHTTP(w, r.WithContext(ctx))
	}
}
func (app *application) routes() http.Handler {
	router := httprouter.New()
	secure := alice.New(app.checkToken)
	router.HandlerFunc(http.MethodGet, "/status", app.statusHandler)
	router.HandlerFunc(http.MethodPost, "/v1/graphql", app.schoolsGraphQL)
	router.HandlerFunc(http.MethodPost, "/v1/signin", app.Signin)
	router.HandlerFunc(http.MethodGet, "/v1/school/:id", app.getOneSchool)
	router.HandlerFunc(http.MethodGet, "/v1/schools", app.getAllSchools)
	router.HandlerFunc(http.MethodGet, "/v1/schools/:genre_id", app.getAllSchoolsByGenre)
	router.HandlerFunc(http.MethodGet, "/v1/genres", app.getAllGenres)

	router.POST("/v1/admin/editschool", app.wrap(secure.ThenFunc(app.editSchool)))
	router.GET("/v1/admin/deleteschool/:id", app.wrap(secure.ThenFunc(app.deleteSchool)))
	return app.enableCORS(router)
}
