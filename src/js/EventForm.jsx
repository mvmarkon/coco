import React, { useState }  from 'react';
import '../css/EventForm.css';
import {useHistory} from "react-router-dom";

const eventData = {name: '', date: '', protocols: '', participants: ''}
const initialData = {name: 'Insertar nombre de evento', date: '', protocols: 'Los protocolos', participants: 'Agregar participantes'}

const EventForm = () => {
    const history = useHistory();

    const [eventData, setEventData] = useState(initialData);
    
    const handleEventChange = (event) => {
        event.preventDefault();
        setEventData({
          ...(eventData),
          [event.target.name]: event.target.value,
        });
    };

    const handleConfirm = (event) =>{
        event.preventDefault();
            /*register(eventData)
            .then((response) => {
                    localStorage.setItem("token", response.headers.authorization);
                    localStorage.setItem("userId", JSON.stringify(response.headers.userid));
                    history.push("/Events"); console.log(eventData); 
                })
            .catch(() => {
                console.log(handleRegisterError(eventData))
                if (handleRegisterError(eventData)){
                    setRegisterUsedError("ErrorVisible")
                }
            })*/
      }

    const handleCancel = (event) =>{
        event.preventDefault();
        setEventData(initialData);
    }

    return (
        <div className="box Container">
            <form className="Form" onSubmit = {handleConfirm} >
                <div className="FormTitle">Crea tu evento</div>
                    <div className = "EventForm">
                        <div className="form-group">
                            <label htmlFor="name">Nombre</label><br/>
                            <input required type="text" name="name" value={eventData.name} onChange={handleEventChange} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Fecha</label><br/>
                            <input required type="date" name="date" value={eventData.date} onChange={handleEventChange} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="protocols">Protocolos</label><br/>
                            <input required type="text" name="protocols" value={eventData.protocols} onChange={handleEventChange} className="form-control" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="participants">Participantes</label><br/>
                            <input type="text" name="participantes" value={eventData.participants} onChange={handleEventChange} className="form-control" />
                        </div>
                    </div>
            </form>
            <div className = "ButtonLeft"><button className="Button ButtonLeft" type="submit" onClick = {handleConfirm}>Confirmar</button></div>
            <div className = "ButtonRight"><button className="Button ButtonRight" type="submit" onClick = {handleCancel}>Cancelar</button></div>
        </div>
    );
}

export default EventForm;