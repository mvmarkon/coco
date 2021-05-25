import React from 'react';
import '../css/CoCo.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect
} from "react-router-dom";

import Start from "./Start";
import EventForm from "./EventForm";
import EventCalendar from "./EventCalendar";
import CovidReportPage from "./CovidReportPage";

const CoCo = () => {

  return (
    <Router>
      <Switch>
        <Route path = "/EventForm" component={EventForm}/>
        <Route path = "/EventCalendar" component={EventCalendar}/>
        <Route path = "/CovidReport" component={CovidReportPage}/>
        <Route path = "/" component={Start}/>
      </Switch>
    </Router>
  );
}

export default CoCo;