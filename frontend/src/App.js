import React, { Component } from 'react';

import SignIn from './Components/SignIn'
import Register from './Components/Register'
import AdvisorView from './Components/Advisor/AdvisorView'

import AdviseeView from './Components/Advisee/AdviseeView'
import SelectAdvisor from './Components/Advisee/SelectAdvisor'
import AdvisorComments from './Components/Comments'

import { Provider } from 'react-redux'
import store from './store'

import isAdvisor from './hoc/isAdvisor'
import isAdvisee from './hoc/isAdvisee'

import jwtDecode from 'jwt-decode'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import {
  setAuthorizationToken,
  setCurrentUser
} from './store/actions/auth'

if (localStorage.jwtToken) {
  setAuthorizationToken(localStorage.jwtToken)
  try {
    store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)))
  } catch (e) {
    store.dispatch(setCurrentUser({}))
  }
}


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Switch>
              <Route exact path="/" component={SignIn} />
              <Route exact path="/advisor"  component={isAdvisor(AdvisorView)} />
              <Route exact path="/register" component={Register} />


              <Route exact path="/comments" component={isAdvisor(AdvisorComments)} />
              <Route exact path="/advisee"  component={isAdvisee(SelectAdvisor)} />
              <Route exact path="/advisee/:advisor_id" component={isAdvisee(AdviseeView)} />

          </Switch>
        </Router>
      </Provider>
    );
  }
}

export default App;
