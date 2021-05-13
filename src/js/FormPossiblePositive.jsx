import React, { useRef, useState } from 'react'
import '../css/FormPossiblePositive.css'

const FormPossibleContact = () => {

    let syntoms = 
    {
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
    const [bodyTemperature,setBodyTemperature ] = useState(35)

    
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(onsetSympstomsDate)
        console.log(bodyTemperature)
        console.log(syntomsSelected)
    }

    const handleTemperatureChange = (e) => {
        setBodyTemperature(e.target.value)
    }

    const handleDateChange = (e) => {
        setOnsetSympstomsDate(e.target.value)
    }


    const handleElementChange=(evt)=>{
        let element = evt.target.name
        console.log(element)
        if(syntomsSelected.some(e=>e===element)){
            setSyntomsSelected(syntomsSelected.filter(e=>e!==element))
        }
        else{
            setSyntomsSelected(syntomsSelected.concat(element))
        }
    }



    return  ( 
    
        <form className="form_possible_contact" onSubmit={handleSubmit} >
            <div className="form_section">
                <label htmlFor="onset_syntoms_date">
                    Fecha de comienzo de sintomas:
                </label>
                <input type="date" name="onset_syntoms_date" onChange={handleDateChange} value={onsetSympstomsDate}
                />
            </div>
            <div className="form_section">
            <label htmlFor="body_temperature">
                    Temperatura corporal:
                </label>
                <input type="number" min='35' max='45' name="body_temperature" onChange={handleTemperatureChange} value={bodyTemperature} />
            </div>
            <div className="form_section" >
                <fieldset name="syntoms" >
                    <legend>Sintomas</legend>
                    {syntoms_array.map((element,index) =>                         
                            <div key={index}>
                                <input type='checkbox' 
                                name={element} onChange={handleElementChange} checked={syntomsSelected.some(e=>e===element)}/> {syntoms[element]}
                                <br/>
                            </div>                        
                            )
                    }
                </fieldset>
            </div>
            <div className="form_section btn_section">
                <button className="submit_btn">
                    Notificar a conocidos
                </button>
            </div>
        </form>
    )
}

export default FormPossibleContact

