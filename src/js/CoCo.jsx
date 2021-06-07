import React from 'react';
import '../css/CoCo.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect
} from "react-router-dom";

import Start from "./User/Start";
import EventForm from "./Event/EventForm";
import EventCalendar from "./Event/EventCalendar";
import CovidReportPage from "./Cases/CovidReportPage";
import Notifications from "./Notification/NotificationList";
import Contacts from "./User/Contacts"

const CoCo = () => {

  return (
    <Router>
      <Switch>
        <Route path = "/EventForm" component={EventForm}/>
        <Route path = "/EventCalendar" component={EventCalendar}/>
        <Route path = "/CovidReport" component={CovidReportPage}/>
        <Route path = "/Notifications" component={Notifications}/>
        <Route path = "/Contacts" component={Contacts}/>
        <Route path = "/" component={Start}/>
      </Switch>
    </Router>
  );
}

export default CoCo;