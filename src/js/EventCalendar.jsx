import React from 'react'
import '../css/EventCalendar.css'

const EventCalendar = () => {
    
    // const [upcomingEvents,setUpcomingEvents]= useState()


    const eventOne = {
        eventName: 'Primer evento',
        protocols: 'Protocolos del evento',
        date: new Date().toLocaleDateString(),
        duration: 4,
        participants: [{name:'user1',edad:24},{name:'user2',edad:27}]
    }

    const eventTwo= {
        eventName: 'Segundo evento',
        protocols: 'Protocolos del evento',
        date: new Date().toLocaleDateString(),
        duration: 1,
        participants: [{name:'user3',edad:26},{name:'user4',edad:40}]
    }



    const events = [eventOne,eventTwo]

    return (

        <>
        {
            events.map( event => {
                return (
                <div className="event-container">
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
                        <br/>
                        <span>Duracion(hs): {event.duration}</span> 
                    </div>
                    <div className="event-section event-guests-info">
                        <h4 >Invitados</h4>               
                        <ul>
                            {event.participants.map(participant=>
                                <li>
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