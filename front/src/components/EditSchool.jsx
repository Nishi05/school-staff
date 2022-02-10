import React, { Component, Fragment } from 'react'
import './EditSchool.css'
import Input from './form/Input'
import TextArea from './form/TextArea'
import Select from './form/Select'
import Alert from './ui/Alert'
import { Link } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
export default class EditSchool extends Component {
  state = {
    school: {},
    mpaaOptions: [],
    isLoaded: false,
    error: null,
  }
  constructor(props) {
    super(props)
    this.state = {
      school: {
        id: 0,
        title: '',
        release_date: '',
        runtime: '',
        mpaa_rating: '',
        rating: '',
        description: '',
      },
      mpaaOptions: [
        { id: 'G', value: 'G' },
        { id: 'PG', value: 'PG' },
        { id: 'PG13', value: 'PG13' },
        { id: 'R', value: 'R' },
        { id: 'NC17', value: 'NC17' },
      ],
      isLoaded: false,
      error: null,
      errors: [],
      alert: {
        type: 'd-none',
        message: '',
      },
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit = (evt) => {
    evt.preventDefault()

    let errors = []
    if (this.state.school.title === '') {
      errors.push('title')
    }

    this.setState({ errors: errors })

    if (errors.length > 0) {
      return false
    }

    const data = new FormData(evt.target)
    const payload = Object.fromEntries(data.entries())
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', 'Bearer ' + this.props.jwt)

    const requestOptions = {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: myHeaders,
    }
    fetch(
      `${process.env.REACT_APP_API_URL}/v1/admin/editschool`,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          this.setState({
            alert: { type: 'alert-danger', message: data.error.message },
          })
        } else {
          this.props.history.push({
            pathname: '/admin',
          })
        }
      })
  }

  handleChange = (evt) => {
    let value = evt.target.value
    let name = evt.target.name
    this.setState((prevState) => ({
      school: {
        ...prevState.school,
        [name]: value,
      },
    }))
  }

  hasError(key) {
    return this.state.errors.indexOf(key) !== -1
  }

  componentDidMount() {
    if (this.props.jwt === '') {
      this.props.history.push({
        pathname: '/login',
      })
      return
    }
    const id = this.props.match.params.id
    if (id > 0) {
      fetch(`${process.env.REACT_APP_API_URL}/v1/school/` + id)
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
          const releaseDate = new Date(json.school.release_date)

          this.setState(
            {
              school: {
                id: id,
                title: json.school.title,
                release_date: releaseDate.toISOString().split('T')[0],
                runtime: json.school.runtime,
                mpaa_rating: json.school.mpaa_rating,
                rating: json.school.rating,
                description: json.school.description,
              },
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
    } else {
      this.setState({ isLoaded: true })
    }
  }

  confirmDelete = (e) => {
    confirmAlert({
      title: 'Delete School?',
      message: 'Are you sure?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const myHeaders = new Headers()
            myHeaders.append('Content-Type', 'application/json')
            myHeaders.append('Authorization', 'Bearer ' + this.props.jwt)
            fetch(
              `${process.env.REACT_APP_API_URL}/v1/admin/deleteschool/` +
                this.state.school.id,
              { method: 'GET', headers: myHeaders }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.error) {
                  this.setState({
                    alert: {
                      type: 'alert-danger',
                      message: data.error.message,
                    },
                  })
                } else {
                  this.props.history.push({
                    pathname: '/admin',
                  })
                }
              })
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    })
  }
  render() {
    let { school, isLoaded, error } = this.state

    if (error) {
      return <div>Error: {error.message}</div>
    } else if (!isLoaded) {
      return <p>Loading ...</p>
    } else {
      return (
        <Fragment>
          <h2>Add/ Edit school</h2>
          <Alert
            alertType={this.state.alert.type}
            alertMessage={this.state.alert.message}
          />
          <hr />
          <form onSubmit={this.handleSubmit}>
            <input
              type="hidden"
              name="id"
              id="id"
              value={school.id}
              onChange={this.handleChange}
            />
            <Input
              title={'Title'}
              className={this.hasError('title') ? 'is-invalid' : ''}
              type={'text'}
              name={'title'}
              value={school.title}
              handleChange={this.handleChange}
              errorDiv={this.hasError('title') ? 'text-danger' : 'd-none'}
              errorMsg={'Please enter a title'}
            />
            <Input
              title={'Release Date'}
              type={'date'}
              name={'release_date'}
              value={school.release_date}
              handleChange={this.handleChange}
            />
            <Input
              title={'Runtime'}
              type={'text'}
              name={'runtime'}
              value={school.runtime}
              handleChange={this.handleChange}
            />
            <Select
              title={'MPAA_rating'}
              name={'mpaa_rating'}
              options={this.state.mpaaOptions}
              value={school.mpaa_rating}
              handleChange={this.handleChange}
              placeholder={'Choose...'}
            />

            <Input
              title={'Rating'}
              type={'text'}
              name={'rating'}
              value={school.rating}
              handleChange={this.handleChange}
            />
            <TextArea
              title={'Description'}
              name={'description'}
              value={school.description}
              handleChange={this.handleChange}
            />

            <hr />
            <button className="btn btn-primary">Save</button>
            <Link to="/admin" className="btn btn-warning ms-1">
              Cancel
            </Link>
            {school.id > 0 && (
              <a
                href="#!"
                onClick={() => this.confirmDelete()}
                className="btn btn-danger ms-1"
              >
                Delete
              </a>
            )}
          </form>
        </Fragment>
      )
    }
  }
}
