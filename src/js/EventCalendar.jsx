import React,{useEffect,useState} from 'react'
import '../css/EventCalendar.css'

const EventCalendar = () => {    
    const [upcomingEvents,setUpcomingEvents]= useState([])

    console.log(upcomingEvents)
    useEffect(() => {
        const fetchData = async () => {
            const events = await fetch('/api/events/organizer/60967a887dcec85999f5ed1d')
                        .then((res)=>res.json())
            const users = await fetch("/api/users").then(res =>res.json())
            const id = 0 
            const evts = events.map(evt=>{
                const eventId = id
                const organizerId = evt.organizer
                const participantsId = evt.participants
                const organizer= users.find(user=>organizerId === user._id )
                const participants= users.filter(user=>participantsId.some(participant=>user._id===participant)) 
                id += 1
                return {...evt,organizer,participants}
            })

        setUpcomingEvents(evts)
                                        
        }
        
        fetchData()

    }
    
    
    , [setUpcomingEvents])

    return (
        <>
        {
            upcomingEvents.map( event => {
                return (
                <div className="event-container" key={event.id}>
                    <p className="event-section event-title">
                        {event.eventName}
                    </p>
                    <p className="event-section event-protocols-info">
                        {event.protocols}
                    </p>
                    <div className="event-section event-date-info">
                        <time>
                            Fecha: {event.date}
                        </time>
                    </div>
                    <div className="event-section event-guests-info">
                        <h3>Organizador :</h3><span>{event.organizer.name}</span>
                        <h4 >Invitados</h4>               
                        <ul>
                            {event.participants.map(participant=>
                                <li key = { participant._id}>
                                    {participant.name}                            
                                </li>
                                )}
                        </ul>
                    </div>
                </div>)
            })
        }    
        </>
    )
}

export default EventCalendar