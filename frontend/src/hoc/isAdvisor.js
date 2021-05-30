import React, { Component } from 'react'
import { connect } from 'react-redux'

export default function isAdvisor(ComponentToBeRendered) {
  class Authenticated extends Component {
    componentWillMount() {
      if (!this.props.isAuthenticated) {
        this.props.history.push("/signIn")
      }
    }

    componentWillUpdate() {
      if (!this.props.isAuthenticated) {
        this.props.history.push("/signIn")
      }
    }

    render() {
      return <ComponentToBeRendered {...this.props} />
    }
  }

  const mapStateToProps = state => {
    const { userReducer } = state
    return { isAuthenticated: userReducer.user.hasOwnProperty('advisor_id') }
  }

  return connect(mapStateToProps)(Authenticated)

}