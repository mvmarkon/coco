import React, { useState, useEffect } from "react";
import { NavLink } from 'react-router-dom';
import '../css/CoCo.css';


const NavBar = () => {

    const [logged, setLog] = useState(localStorage.getItem('token') === null);
    const [click, setClick] = useState(false);

    const handleClick = () => {
        setLog(localStorage.getItem('token') === null)
        setClick(!click)
        console.log(logged)
    };

    const handleLogout = () => {
        localStorage.clear()
        handleClick()
    };

    return (
        <nav className="navBar">
            <div className="nav-container">
                <NavLink exact to="/" className="nav-logo">
                    <img src="Logo-Back.png" className="nav-logo" alt="CoCo"/>
                </NavLink>

                <div className="nav-icon" onClick={handleClick}>
                    <i className={click ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                <div id="logged" hidden={logged} onClick={handleClick}>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink exact to="/Profile" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Profile
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/EventForm" activeClassName="active" className="nav-links" onClick={handleClick} >
                                New Event
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/EventCalendar" activeClassName="active" className="nav-links" onClick={handleClick} >
                                Calendar
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/CovidReport" activeClassName="active" className="nav-links" onClick={handleClick} >
                                Health Report
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/Notifications" activeClassName="active" className="nav-links" onClick={handleClick} >
                                Notifications
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/Contacts" activeClassName="active" className="nav-links" onClick={handleClick} >
                                Contacts   
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/" activeClassName="active" className="nav-links" onClick={handleLogout} >
                                LogOut   
                            </NavLink>
                        </li>
                    </ul>
                </div>
                <div id="toLog" hidden={!logged} onClick={handleClick}>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink exact to="/Login" activeClassName="active" className="nav-links" onClick={handleClick}>
                                Login
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink exact to="/Register" activeClassName="active" className="nav-links" onClick={handleClick} >
                                Register
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default NavBar;
