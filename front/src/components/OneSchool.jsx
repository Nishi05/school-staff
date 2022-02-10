import React, { Component, Fragment } from 'react'

export default class OneSchool extends Component {
  state = { school: {}, isLoaded: false, error: null }

  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_API_URL}/v1/school/` + this.props.match.params.id
    )
      .then((response) => {
        console.log('Status code is', response.status)
        if (response.status !== '200') {
          let err = Error
          err.message = 'Invalid response code' + response.status
          this.setState({ error: err })
        }
        return response.json()
      })
      .then((json) => {
        this.setState(
          {
            school: json.school,
            isLoaded: true,
          },
          (error) => {
            this.setState({
              isLoaded: true,
              error,
            })
          }
        )
      })
  }
  render() {
    const { school, isLoaded, error } = this.state
    if (school.genres) {
      school.genres = Object.values(school.genres)
    } else {
      school.genres = []
    }
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading ...</p>
    } else {
      return (
        <Fragment>
          <h2>School: {school.name}</h2>

          <div className="float-end">
            {school.genres.map((m, index) => (
              <span className="badge bg-secondary me-1" key={index}>
                {m}
              </span>
            ))}
          </div>
          <div className="clearfix"></div>
          <hr />
          <table className="table table-compact table-striped">
            <thead></thead>
            <tbody>
              <tr>
                <td>
                  <strong>学校名:</strong>
                </td>
                <td>
                  {school.name} {school.id}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>説明:</strong>
                </td>
                <td>{school.description}</td>
              </tr>
            </tbody>
          </table>
        </Fragment>
      )
    }
  }
}
