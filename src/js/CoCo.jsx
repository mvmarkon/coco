import React, { useState } from 'react';
import '../css/CoCo.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Start from "./Start";
import EventForm from "./EventForm";
import EventCalendar from "./EventCalendar";

const CoCo = () => {
  /*const [users, setUsers] = useState();

  const getUsers = () => {
    fetch('/api/users').then(res => res.json()).then(setUsers);
  }*/

  return (
    <Router>
      <Switch>
        <Route path = "/EventForm" component={EventForm}/>
        <Route path = "/EventCalendar" component={EventCalendar}/>
        <Route path = "/" component={Start}/>
      </Switch>
    </Router>
  );
}

export default CoCo;