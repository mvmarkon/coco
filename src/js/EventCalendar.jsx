import React,{useEffect,useState} from 'react'
import '../css/EventCalendar.css'
import {Event} from './Event'

const EventCalendar = () => {    
    const [upcomingEvents,setUpcomingEvents]= useState([])

    useEffect(() => {
        const fetchData = async () => {
            const events = await fetch('api/events/attended/'+ localStorage.getItem('token'))
                    .then((res)=>res.json())
            const users = await fetch("api/users").then(res =>res.json())
            const evts = events.map(evt=>{
                const organizerId = evt.organizer
                const participantsId = evt.participants
                const organizer= users.find(user=>organizerId === user._id )
                const participants= users.filter(user=>participantsId.some(participant=>user._id===participant)) 
                
            return {...evt,organizer,participants}
        })
        setUpcomingEvents(evts)                             
        }
        fetchData()
    }, [setUpcomingEvents])

    console.log(upcomingEvents)
    return (
        <div className='events-container'>
            {
                upcomingEvents.map( event => 
                     <Event 
                         name={event.eventName}
                         date={event.date}
                         hourFrom={event.hourFrom}
                         hourTo={event.hourTo}
                         place={event.place}
                         organizer={event.organizer}
                         participants={event.participants}
                         description={event.description} />
                )
            }    
        </div>
    )
}

export default EventCalendar