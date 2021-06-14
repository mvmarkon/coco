import React, { useState } from 'react'
import '../../css/Cases/FormPossiblePositive.css'

const FormPossibleContact = () => {

    let syntoms = {
        cough: 'Tos',
        throat_pain: 'Dolor de garganta',
        respiratory_distress: 'Dificultad respiratoria',
        headache: 'Dolor de cabeza',
        muscle_pain: 'Dolor muscular',
        diarrhea: 'Diarrea',
        vomits: 'Vomitos',
        loss_of_smell: 'Perdida de olfato',
        lost_taste: 'Perdida de gusto'
    }

    let syntoms_array = Object.keys(syntoms)

    const [onsetSympstomsDate,setOnsetSympstomsDate] = useState(new Date().toUTCString())
    const [syntomsSelected,setSyntomsSelected] = useState([])
    const [bodyTemperature,setBodyTemperature] = useState(35)
    const [notifySuccess,setNotifySuccess] = useState(false)
    
    const handleSubmit = (e) => {
        e.preventDefault()
        fetch('api/notifications/possible_covid/',{
            method: 'POST',
            headers: {'Content-type' : 'application/json'},
            body: JSON.stringify({
                notified:false,
                notificationName:'POSIBLE CASO DE COVID POSITIVO',
                type: 'Posible Positivo',
                date:new Date().toISOString(),
                description: JSON.stringify(syntomsSelected),
                notifier: localStorage.getItem('token')
            })
        })
        .then(res=> { 
            if (res.status===201){
                setNotifySuccess(true)
            } else {console.log('Ocurrio un error el notificar, por favor intentelo mas tarde')}
        })
    }

    const handleTemperatureChange = (e) => {
        setBodyTemperature(e.target.value)
    }

    const handleDateChange = (e) => {
        setOnsetSympstomsDate(e.target.value)
    }

    const handleElementChange=(evt)=>{
        let element = evt.target.name
        if(syntomsSelected.some(e=>e===element)){
            setSyntomsSelected(syntomsSelected.filter(e=>e!==element))
        }
        else{
            setSyntomsSelected(syntomsSelected.concat(element))
        }
    }

    return  (
        <>
            <form className="form_possible_contact" onSubmit={handleSubmit} >
                <h3>Notificar posible covid</h3>
                <div className="form_section">
                    <label htmlFor="onset_syntoms_date">
                        Fecha de comienzo de sintomas:
                    </label>
                    <input type="date" name="onset_syntoms_date" required onChange={handleDateChange} value={onsetSympstomsDate}/>
                </div>
                <div className="form_section">
                    <label htmlFor="body_temperature">
                        Temperatura corporal:
                    </label>
                    <input type="number" min='35' max='45' name="body_temperature" onChange={handleTemperatureChange} value={bodyTemperature} />
                </div>
                <div className="form_section" >
                    <fieldset className="syntoms" name="syntoms" >
                        <legend>Sintomas</legend>
                        {syntoms_array.map((element,index) =>                         
                            <div key={index}>
                                <input type='checkbox' name={element} onChange={handleElementChange} checked={syntomsSelected.some(e=>e===element)}/> 
                                {syntoms[element]}
                                <br/>
                            </div>                        
                        )}
                    </fieldset>
                </div>
                <div className="form_section btn_section">
                    <button className="submit_btn" disabled={notifySuccess}>
                        Notificar a conocidos
                    </button>
                </div>
                {notifySuccess ? <p>Notificacion exitosa</p> : null}
            </form>
        </>
    )
}

export default FormPossibleContact

