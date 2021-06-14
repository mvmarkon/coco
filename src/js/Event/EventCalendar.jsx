import React,{useEffect,useState} from 'react'
import '../../css/Event/EventCalendar.css'
import {Event} from './Event'

const EventCalendar = () => {    
    const [upcomingEvents,setUpcomingEvents]= useState([])
    
    const handleCancelEvent = async (id) => {
        setUpcomingEvents(upcomingEvents.filter(evt=>evt._id!==id))
        fetch(`api/events/cancel_event/${id}`,{method:'DELETE'})
    }

    useEffect(() => {
        const fetchData = async () => {
            const events = await fetch('api/events/attended/'+ localStorage.getItem('token'))
            .then(res => res.json())
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

    return (
        <div className='events-container'>
            {upcomingEvents.map( event =>
                <div className="App-header" key = {event._id}>
                    <Event 
                        onCancelEvent={handleCancelEvent}
                        name={event.eventName}
                        date={event.date}
                        id={event._id}
                        hourFrom={event.hourFrom}
                        hourTo={event.hourTo}
                        place={event.place}
                        organizer={event.organizer}
                        participants={event.participants}
                        description={event.description}
                    />
                </div>
            )}    
        </div>
    )
}

export default EventCalendar