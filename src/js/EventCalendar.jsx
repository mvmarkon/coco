import React,{useEffect,useState} from 'react'
import '../css/EventCalendar.css'

// {place: {name: '', numberParticipants : 1}} 


const EventCalendar = () => {    
    const [upcomingEvents,setUpcomingEvents]= useState([])

    useEffect(() => {
        const fetchData = async () => {
            const events = await fetch('api/events/organizer/60967a887dcec85999f5ed1d')
                        .then((res)=>res.json())
            const users = await fetch("api/users").then(res =>res.json())
            const evts = events.map(evt=>{
            const organizerId = evt.organizer
            const participantsId = evt.participants
            const organizer= users.find(user=>organizerId === user._id )
            const participants= users.filter(user=>participantsId.some(participant=>user._id===participant)) 
            console.log(events)
            return {...evt,organizer,participants}
        })

        setUpcomingEvents(evts)
                                        
        }

        fetchData()
        
    }


    , [setUpcomingEvents])

    const minToTime = (min) =>{
        var limitH = min
        limitH = Math.floor(limitH / 60);
        var limitM = (min % 60)
        return limitH+':'+limitM
      }

    console.log(upcomingEvents)
    return (
        <div className='events-container'>
        {
            upcomingEvents.map( event => {
                return (
                <div className="event-container">
                    <p className="event-section event-title">
                        {event.eventName}
                    </p>
                    <div className="event-section event-date-info">
                        <time>
                            Fecha: {event.date.substring(0,10)}
                            <p>Horario</p>
                            <span>Desde: {minToTime(event.hourFrom)} - </span>
                            <span>Hasta: {minToTime(event.hourTo)}</span>
                        </time>
                        <p>Lugar: {event.place.name}</p>
                        <p>Cantidad maxima de invitados: {event.place.numberParticipants}</p>

                    </div>
                    <div className="event-section">
                        <h4>Organizador : <span>{event.organizer.name}</span></h4>
                        <h4>Invitados</h4>
                        <ul>
                            {event.participants.map(participant=>
                                <li>
                                    {participant.name}                            
                                </li>
                                )}
                        </ul>
                    </div>
                    <div className="event-section event-last-section">
                    <h4>Descripcion:</h4>
                            { event.description }
                    </div>
                </div>)
            })
        }    
        </div>
    )
}

export default EventCalendar