import React from 'react'

export const Event = ({name,description,date,hourTo,hourFrom,place,organizer,participants})=>{


    const minToTime = (min) =>{
        var limitH = min
        limitH = Math.floor(limitH / 60);
        var limitM = (min % 60)
        return limitH+':'+limitM
      }


    return (
        <div className="event-container">
            <p className="event-section event-title">
                {name}
            </p>
            <div className="event-section event-date-info">
                <time>
                    Fecha: {date.substring(0,10)}
                    <p>Horario</p>
                    <span>Desde: {minToTime(hourFrom)} - </span>
                    <span>Hasta: {minToTime(hourTo)}</span>
                </time>
                <p>Lugar: {place.name}</p>
                <p>Cantidad maxima de invitados: {place.numberParticipants}</p>

            </div>
            <div className="event-section">
                <h4>Organizador : <span>{organizer.name}</span></h4>
                <h4>Invitados</h4>
                <ul>
                    {participants.map(participant=>
                        <li>
                            {participant.name}                            
                        </li>
                        )}
                </ul>
            </div>
            <div className="event-section event-last-section">
            <h4>Descripcion:</h4>
                    { description }
            </div>
        </div>)
    
}