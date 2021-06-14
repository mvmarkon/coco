import React, { useState, useEffect,  }  from 'react';
import {useHistory} from "react-router-dom";
import '../../css/CoCo.css';
import '../../css/Event/EventForm.css';
import TimePicker from 'react-time-picker'

const initialData = {organizer: '', eventName: 'Insertar nombre de evento', date: '', hourFrom: '00:00', hourTo: '00:00',  place: {name: '', numberParticipants : 1}, participants: [], description: ''}

const EventForm = () => {

  const history = useHistory();
  const [eventData, setEventData] = useState(initialData);
  const [user, setUser] = useState({});
  const [protocols, setProtocols] = useState({allowedHourFrom: 0, allowedHourTo: 1440, allowedPlaces: [{}]})
  const [known, setKnown] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [limitParticipants, setLimitParticipants] = useState("??");
  const [onLimit, setLimit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usr = await fetch('/api/users/' + localStorage.getItem('token'))
        .then((res) => res.json()) 
      const prt = await fetch('/api/protocols/active')
        .then((res) => res.json())

      await fetch('/api/users/idstonicknames',{
          method: 'POST',
          body: JSON.stringify(usr.known),
          headers:{
            'Content-Type': 'application/json'
          }
      })
      .then(res => res.json())
      .then(res => setKnown(res))
      setParticipants([])
      setProtocols(prt)
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
    setEventData({
      ...(eventData),
      hourFrom: event,
    });
  };

  const handleHourTo = (event) =>{
    setEventData({
      ...(eventData),
      hourTo: event,
    });
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
    var newA = known.concat(participants)
    setKnown(newA) 
    setParticipants([])
  }

  const addParticipant = (event) =>{
    var user = {_id: event.target.value, nickName: event.target.name}
    var changeIndex = known.map(function(u) { return u._id; }).indexOf(user._id);
    var newC = known
    newC.splice(changeIndex, 1)
    
    //var newP = participants.concat([event.target.name])
    var participant = user

    setEventData({
      ...(eventData),
      'place': {name: eventData.place.name, numberParticipants: eventData.place.numberParticipants + 1},
    });

    setKnown(newC)
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
    var user = {_id: event.target.value, nickName: event.target.name}
    var changeIndex = participants.map(function(u) { return u._id; }).indexOf(user._id);
    var newP = participants
    newP.splice(changeIndex, 1)

    var newC = known.concat([user])
    //newC.push(event.target.name)

    setEventData({
      ...(eventData),
      'place': {name: eventData.place.name, numberParticipants: eventData.place.numberParticipants - 1},
    });

    setParticipants(newP)
    setKnown(newC)

    checkLimit()
  }

  const handleConfirm = (event) =>{
      setEventData({
        ...(eventData),
      })
      var data = Object.assign({}, eventData)
      data['organizer'] = user._id
      data['place'] = {name: eventData.place.name, numberParticipants: participants.length + 1}
      data['participants'] = participants.map(u => u._id)
      data.hourTo = timeToMin(eventData.hourTo)
      data.hourFrom = timeToMin(eventData.hourFrom)
      postData('api/events/', data)
  }

  const goToCalendar = () => {
    history.push("/EventCalendar")
    window.location.reload()
  }

  const postData = (url, data) =>{
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
      res.json()
    })
    .catch(error => console.error('Error:', error))
    return response;
  }

  const handleCancel = (event) =>{
        event.preventDefault();
        setEventData(initialData);
  }

  return (
    <div className="box Container App-header">
        <div className="FormTitle">Crea tu evento</div>
        <form className="Form EventForm">
            <div className="row mb-3 input input">
                <label htmlFor="eventName" className="col-form-label">
                    Nombre:
                </label>
                <div className="col-sm-10">
                    <input className="form-control" type="text" id="eventName" name="eventName" value={eventData.eventName} onChange={handleEventChange} required/>
                </div>                
            </div>
            <div className="row mb-3 input">
                <label htmlFor="date" className="col-form-label">
                    Fecha:
                </label>
                <br/>
                <div className="col-sm-10">
                    <input className="form-control" type="date" id="date" name="date" value={eventData.date} onChange={handleEventChange} required/>
                </div>
            </div>
            <div className="row mb-3 input">
                <label htmlFor="eventHourFrom" className="col-form-label">
                    Hora Inicio:
                </label>
                <br/>
                <div className="col-sm-10">
                    <TimePicker 
                        minTime={minToTime(protocols.allowedHourFrom)} 
                        maxTime={minToTime(protocols.allowedHourTo)} 
                        name="eventHourFrom" 
                        value={eventData.hourFrom} 
                        onChange={handleHourFrom}
                        className="form-control"
                        id="eventHourFrom"
                    />
                </div>                
            </div>
            <div className="row mb-3 input">
                <label htmlFor="eventHourTo" className="col-form-label">
                    Hora Fin:
                </label>
                <br/>
                <div className="col-sm-10">
                    <TimePicker 
                        minTime={minToTime(protocols.allowedHourFrom)} 
                        maxTime={minToTime(protocols.allowedHourTo)} 
                        name="eventHourTo" value={eventData.hourTo} 
                        onChange={handleHourTo}
                        className="form-control" 
                        id="eventHourTo"
                    />
                </div>                
            </div>
            <fieldset className="row mb-3 input">
                <legend className="col-form-label pt-0" htmlFor="eventProtocols">
                    Lugar:
                </legend>
                <br/>
                <div className="col-sm-10">
                    <div className="form-check radio" onChange = {handleLimit}>
                        {protocols.allowedPlaces.map((p, index) =>
                            <div key={'gridPlaces'+ index}>
                                <input className="form-check-input" type="radio" name={p.name} id={'gridPlaces'+ index} value = {p.limit}/>
                                <label className="form-check-label" htmlFor={'gridPlaces'+ index}>
                                    {p.name}
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </fieldset>
            <div className="row mb-3 input">
                <div className="dropdown col-form-label">
                    <button className="dropbtn">
                        Conocidos
                    </button>
                    <div className="dropdown-content col-sm-10">
                        {known.map(a=>
                            <button key = {a._id} onClick ={addParticipant} value={a._id} name = {a.nickName} disabled = {onLimit}>
                              {a.nickName}                            
                            </button>
                        )}
                    </div>
                </div>                
            </div>
            <div className="row mb-3 input">
                <label htmlFor="Participants" className="col-form-label">
                    Participantes ({eventData.place.numberParticipants}/{limitParticipants}):
                </label>
                <br/>
                <div className="col-sm-10">
                    <button key = {user._id} disabled>
                        {user.nickName}                            
                    </button>
                    {participants.map(p=>
                        <button key = {p._id} onClick ={quitParticipant} value={p._id} name = {p.nickName}>
                          {p.nickName}                            
                        </button>
                    )}
                </div>                
            </div>
            <div className="row mb-3 input">
                <label htmlFor="eventName" className="col-form-label">
                    Descripcion:
                </label>
                <br/>
                <div className="col-sm-10">
                    <input required type="text" name="description" id="eventName" value={eventData.description} onChange={handleEventChange} className="form-control"/>
                </div>                
            </div>
            <div className = "ButtonRight">
                <button className="Button ButtonRight" type="submit" onClick = {handleConfirm}>
                    Confirmar
                </button>
            </div>
            <div className = "ButtonLeft">
                <button className="Button ButtonLeft" type="submit" onClick = {handleCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    </div>
    );
}

export default EventForm;