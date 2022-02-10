import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

export default class OneGenre extends Component {
  state = {
    schools: {},
    isLoaded: false,
    error: null,
    genreName: '',
  }

  componentDidMount() {
    fetch(
      `${process.env.REACT_APP_API_URL}/v1/schools/` +
        this.props.match.params.id
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
            schools: json.schools,
            isLoaded: true,
            genreName: this.props.location.genreName,
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
    let { schools, isLoaded, error, genreName } = this.state
    if (!schools) {
      schools = []
    }

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading ...</p>
    } else {
      return (
        <Fragment>
          <h2>Genre: {genreName}</h2>
          <div className="list-group">
            {schools.map((m) => (
              <Link
                key={m.id}
                to={`/schools/${m.id}`}
                className="list-group-item list-group-item-action"
              >
                {m.title}
              </Link>
            ))}
          </div>
        </Fragment>
      )
    }
  }
}
