import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./account/Login";
import Signup from "./account/Signup";
import Profile from "./account/Profile";
import SignupSuccessful from "./account/SignupSuccessful";
import Verify from "./account/Verify";
import ResetPassword from "./account/ResetPassword";
import ResetPasswordConfirm from "./account/ResetPasswordConfirm";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { store } from "../state/store";

// Alert Options
const alertOptions =  {
  timeout: 3000,
  position: 'top center'
}

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <AlertProvider template={AlertTemplate} {...alertOptions}>
          <Router>
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/signup-successful" component={SignupSuccessful} />
              <Route path="/account/profile" component={Profile} />
              <Route path="/account/verify/:uid/:token" component={Verify} />
              <Route path="/account/reset-password" component={ResetPassword} />
              <Route path="/account/reset-password-confirm/:uid/:token" component={ResetPasswordConfirm} />
            </Switch>
          </Router>
        </AlertProvider>
      </Provider>
    );
  }
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);