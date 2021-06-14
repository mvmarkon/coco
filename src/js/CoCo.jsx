import React from 'react';
import '../css/CoCo.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect
} from "react-router-dom";

import NavBar from "./NavBar"
import Start from "./User/Start";
import Register from "./User/Register";
import Login from "./User/Login";
import Profile from "./User/Profile"
import EventForm from "./Event/EventForm";
import EventCalendar from "./Event/EventCalendar";
import CovidReportPage from "./Cases/CovidReportPage";
import Notifications from "./Notification/NotificationList";
import Contacts from "./User/Contacts"

const CoCo = () => {

  return (
    <Router>
      <NavBar />
      <div className="App-header">
        <Switch>
          <Route path = "/Profile" component={Profile}/>
          <Route path = "/Login" component={Login}/>
          <Route path = "/Register" component={Register}/>
          <Route path = "/EventForm" component={EventForm}/>
          <Route path = "/EventCalendar" component={EventCalendar}/>
          <Route path = "/CovidReport" component={CovidReportPage}/>
          <Route path = "/Notifications" component={Notifications}/>
          <Route path = "/Contacts" component={Contacts}/>
          <Route path = "/" component={Start}/>
        </Switch>
      </div>
    </Router>
  );
}

export default CoCo;