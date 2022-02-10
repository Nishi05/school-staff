import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'

export default class Schools extends Component {
  state = {
    schools: [],
    isLoaded: false,
    error: null,
  }

  componentDidMount() {
    console.log(process.env.REACT_APP_API_URL)
    fetch(`${process.env.REACT_APP_API_URL}/v1/schools`)
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
    const { schools, isLoaded, error } = this.state
    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading ...</p>
    } else {
      return (
        <Fragment>
          <h2>Choose a school</h2>
          <div className="list-group">
            {schools.map((m) => (
              <Link
                key={m.id}
                className="list-group-item list-group-item-action"
                to={`/schools/${m.id}`}
              >
                {m.name}
              </Link>
            ))}
          </div>
        </Fragment>
      )
    }
  }
}
