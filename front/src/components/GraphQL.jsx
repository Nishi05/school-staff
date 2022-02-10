import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom/cjs/react-router-dom.min'
import Input from './form/Input'

export default class GraphQL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      schools: [],
      isLoaded: false,
      error: null,
      alert: {
        type: 'd-none',
        message: '',
      },
      searchTerm: '',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange = (evt) => {
    let value = evt.target.value
    this.setState(
      {
        searchTerm: value,
      },
      () => {
        this.performSearch()
      }
    )
  }

  performSearch() {
    const payload = `
    {
        search(nameContains: "${this.state.searchTerm}") {
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
        console.log(data)
        let theList = Object.values(data.data.search)
        return theList
      })
      .then((theList) => {
        console.log(theList)
        if (theList.length > 0) {
          this.setState({
            schools: theList,
          })
        } else {
          this.setState({
            schools: [],
          })
        }
      })
  }

  componentDidMount() {
    const payload = `
      {
          list {
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
        console.log(data)

        let theList = Object.values(data.data.list)
        return theList
      })
      .then((theList) => {
        console.log(theList)
        this.setState({
          schools: theList,
        })
      })
  }
  render() {
    let { schools } = this.state
    return (
      <Fragment>
        <h2>募集学校一覧</h2>
        <hr />
        <Input
          title={'学校名検索'}
          type={'text'}
          name={'search'}
          value={this.state.searchTerm}
          handleChange={this.handleChange}
        />
        <div className="list-group">
          {schools.map((m) => (
            <Link
              key={m.id}
              to={`/schoolsgraphql/${m.id}`}
              className="list-group-item list-group-item-action"
            >
              <strong>学校名:{m.name}</strong>
              <br />
              {m.description.slice(0, 100)}...
            </Link>
          ))}
        </div>
      </Fragment>
    )
  }
}
