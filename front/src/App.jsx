import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Schools from './components/Schools'
import Home from './components/Home'
import Admin from './components/Admin'
import OneSchool from './components/OneSchool'
import Genres from './components/Genres'
import OneGenre from './components/OneGenre'
import EditSchool from './components/EditSchool'
import Login from './components/auth/Login'
import GraphQL from './components/GraphQL'
import OneSchoolGraphQL from './components/OneSchoolGraphQL'
export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      jwt: '',
    }
    this.handleJWTChange(this.handleJWTChange.bind(this))
  }

  handleJWTChange = (jwt) => {
    this.setState({ jwt: jwt })
  }

  logout = () => {
    this.setState({ jwt: '' })
    window.localStorage.removeItem('jwt')
  }
  componentDidMount() {
    let t = window.localStorage.getItem('jwt')
    if (t) {
      if (this.state.jwt === '') {
        this.setState({ jwt: JSON.parse(t) })
      }
    }
  }
  render() {
    // let loginLink
    // if (this.state.jwt === '') {
    //   loginLink = <Link to="/login">Login</Link>
    // } else {
    //   loginLink = (
    //     <Link to="/logout" onClick={this.logout}>
    //       Logout
    //     </Link>
    //   )
    // }
    return (
      <Router>
        <div className="container">
          <div className="row">
            <div className="col mt-3">
              <h1 className="mt-3">スクスタtest(開発中)</h1>
            </div>
            {/* <div className="col mt-3 text-end">{loginLink}</div> */}
            <hr className="mb-3"></hr>
          </div>
          <div className="row">
            <div className="col-md-2">
              <nav>
                <ul className="list-group">
                  <li className="list-group-item">
                    <Link to="/">スクスタとは</Link>
                  </li>
                  {/* <li className="list-group-item">
                    <Link to="/schools">Schools</Link>
                  </li>
                  <li className="list-group-item">
                    <Link to="/genres">Genres</Link>
                  </li>
                  {this.state.jwt !== '' && (
                    <Fragment>
                      <li className="list-group-item">
                        <Link to="/admin/school/0">Add School</Link>
                      </li>
                      <li className="list-group-item">
                        <Link to="/admin">Manage Catalogue</Link>
                      </li>
                    </Fragment>
                  )} */}
                  <li className="list-group-item">
                    <Link to="/graphql">学校一覧</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="col-md-10">
              <Switch>
                <Route path="/schools/:id" component={OneSchool} />
                <Route
                  path="/schoolsgraphql/:id"
                  component={OneSchoolGraphQL}
                />
                <Route path="/schools">
                  <Schools />
                </Route>

                <Route
                  exact
                  path="/login"
                  component={(props) => (
                    <Login {...props} handleJWTChange={this.handleJWTChange} />
                  )}
                />
                <Route path="/genre/:id" component={OneGenre} />

                <Route exact path="/genres">
                  <Genres />
                </Route>

                <Route exact path="/graphql">
                  <GraphQL />
                </Route>
                <Route
                  path="/admin/school/:id"
                  component={(props) => (
                    <EditSchool {...props} jwt={this.state.jwt} />
                  )}
                />
                <Route
                  path="/admin"
                  component={(props) => (
                    <Admin {...props} jwt={this.state.jwt} />
                  )}
                ></Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </div>
          </div>
        </div>
      </Router>
    )
  }
}
