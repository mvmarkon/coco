import React, { useState, useEffect,  }  from 'react';
import '../css/EventForm.css';
import {useHistory} from "react-router-dom";
import TimePicker from 'react-time-picker'

const initialData = {organizer: '', eventName: 'Insertar nombre de evento', date: '', hourFrom: '00:00', hourTo: '00:00',  place: {name: '', numberParticipants : 1}, participants: [], description: ''}

const EventForm = () => {

  const history = useHistory();
  const [eventData, setEventData] = useState(initialData);
  const [user, setUser] = useState({});
  const [protocols, setProtocols] = useState({allowedHourFrom: 0, allowedHourTo: 1440, allowedPlaces: [{}]})
  const [acquaintances, setAcquaintances] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [limitParticipants, setLimitParticipants] = useState("Elegir Lugar");
  const [onLimit, setLimit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usr = await fetch('/api/users/' + localStorage.getItem('token'))
        .then((res) => res.json()) 
      const prt = await fetch('/api/protocols/active')
        .then((res) => res.json())
      setAcquaintances(usr.acquaintances)
      setParticipants([])
      setProtocols(prt)
      console.log(usr)
      setUser(usr)
    }
    fetchData()
  }, [setUser]);

  const handleEventChange = (event) =>{
    event.preventDefault();
    setEventData({
      ...(eventData),
      [event.target.name]: event.target.value,
    });
  };

  const handleHourFrom = (event) =>{
    console.log(event)
    setEventData({
      ...(eventData),
      hourFrom: event,
    });
    console.log(eventData.hourFrom)
  };

  const handleHourTo = (event) =>{
    setEventData({
      ...(eventData),
      hourTo: event,
    });
    console.log(eventData.hourTo)
  };

  const timeToMin = (time) =>{
    var hourM = time
    if (time == null){
      hourM = '00:00'
    }
    hourM = hourM.split(':')
    return (+hourM[0])*60 + (+hourM[1])
  }

  const minToTime = (min) =>{
    var limitH = min
    limitH = Math.floor(limitH / 60);
    var limitM = (min % 60)
    return limitH+':'+limitM
  }

  const handleLimit = (event) =>{
    clearParticipants()
    setLimitParticipants(event.target.value)
    setLimit(false)
    eventData['place'] = {name: event.target.name, numberParticipants: 1}
  }

  const clearParticipants  = () =>{
    var newA = acquaintances.concat(participants)
    setAcquaintances(newA) 
    setParticipants([])
  }

  const addParticipant = (event) =>{
    var changeIndex = acquaintances.indexOf(event.target.name)
    var newC = acquaintances
    newC.splice(changeIndex, 1)
    
    //var newP = participants.concat([event.target.name])
    var participant = event.target.name

    setAcquaintances(newC)
    //setParticipants(newP)
    setParticipants(prevParticipants => ([...prevParticipants, ...[participant]]))

    checkLimit()
  }

  const checkLimit = () =>{
    if (participants.length >= limitParticipants - 2){
      setLimit(true)
    } else{
      setLimit(false)
    }
  }

  const quitParticipant = (event) =>{
    var changeIndex = participants.indexOf(event.target.name)
    var newP = participants
    newP.splice(changeIndex, 1)

    var newC = acquaintances.concat([event.target.name])
    //newC.push(event.target.name)

    setParticipants(newP)
    setAcquaintances(newC)

    checkLimit()
  }

  const handleConfirm = (event) =>{
      setEventData({
        ...(eventData),
      })
      var data = Object.assign({}, eventData)
      data['organizer'] = user._id
      data['place'] = {name: eventData.place.name, numberParticipants: participants.length + 1}
      data['participants'] = participants
      data.hourTo = timeToMin(eventData.hourTo)
      data.hourFrom = timeToMin(eventData.hourFrom)
      postData('api/events/', data)
  }

  const goToCalendar = () => {
    history.push("/EventCalendar")
    window.location.reload()
  }

  const postData = (url, data) =>{ 
      console.log(data)
        const response = fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
          headers:{
            'Content-Type': 'application/json'
          }
        })
        .then(res => {
          console.log('Success:', response)
          goToCalendar() 
          res.json()})
        .catch(error => console.error('Error:', error))
      console.log(response)
      return response;
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
                            <label htmlFor="eventName">Nombre</label><br/>
                            <input required type="text" name="eventName" value={eventData.eventName} onChange={handleEventChange} className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="date">Fecha</label><br/>
                            <input required type="date" name="date" value={eventData.date} onChange={handleEventChange} className="form-control"/>
                        </div>
                        <div className="form-group">
                          <label htmlFor="date">Hora Inicio</label><br/>
                          <TimePicker minTime={minToTime(protocols.allowedHourFrom)} maxTime={minToTime(protocols.allowedHourTo)} name="hourFrom" value={eventData.hourFrom} onChange={handleHourFrom}/>
                        </div>
                        <div className="form-group">
                          <label htmlFor="date">Hora Fin</label><br/>
                          <TimePicker minTime={minToTime(protocols.allowedHourFrom)} maxTime={minToTime(protocols.allowedHourTo)} name="hourTo" value={eventData.hourTo} onChange={handleHourTo}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="protocols">Lugar permitido</label><br/>
                            <div className="radio" onChange = {handleLimit}>
                              {protocols.allowedPlaces.map(p =>
                              <div>
                                  <input type="radio" key={p.name} name = "place" value = {p.limit}/>
                                  <label>{p.name}</label>
                              </div>
                              )}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="dropdown">
                              <button className="dropbtn">Conocidos</button>
                              <div className="dropdown-content">
                                {acquaintances.map(a=>
                                  <button key = {a} onClick ={addParticipant} name = {a} disabled = {onLimit}>
                                    {a}                            
                                  </button>
                                )}
                              </div>
                            </div>
                        </div>
                        <div className="form-group">    
                          <label htmlFor="Participants">Participants ({limitParticipants})</label><br/>
                            <button key = {user._id} disabled>
                              {user._id}                            
                            </button>
                            {participants.map(p=>
                              <button key = {p} onClick = {quitParticipant} name = {p}>
                                {p}                            
                              </button>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="eventName">Descripcion</label><br/>
                            <input required type="text" name="description" value={eventData.description} onChange={handleEventChange} className="form-control"/>
                        </div>
                    </div>
            </form>
            <div className = "ButtonLeft"><button className="Button ButtonLeft" type="submit" onClick = {handleConfirm}>Confirmar</button></div>
            <div className = "ButtonRight"><button className="Button ButtonRight" type="submit" onClick = {handleCancel}>Cancelar</button></div>
        </div>
    );
}

export default EventForm;