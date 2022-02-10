import React, { Component, Fragment } from 'react'

export default class OneSchoolGraphQL extends Component {
  state = { school: {}, isLoaded: false, error: null }

  componentDidMount() {
    const payload = `
    {
        school(id: ${this.props.match.params.id}) {
            id
            name
            recruit_type
            salary
            description
        }
    }
    `

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    const requestOptions = {
      method: 'POST',
      body: payload,
      headers: myHeaders,
    }

    fetch(`${process.env.REACT_APP_API_URL}/v1/graphql`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          school: data.data.school,
          isLoaded: true,
        })
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
          <h2>学校名: {school.name}</h2>

          <div className="float-start">
            <small>{school.mpaa_rating}</small>
          </div>
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
                  <strong>募集形態:</strong>
                </td>
                <td>{school.recruit_type}</td>
              </tr>
              <tr>
                <td>
                  <strong>給与:</strong>
                </td>
                <td>{school.salary}</td>
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
