import React, {useState} from 'react'
import '../css/FormCloseContact.css'


const FormCloseContact = () => {

    const [contactDate,setContactDate] = useState(new Date().toISOString())
    const [stateCovid,setStateCovid] = useState('1')
    
    const handleDateChange = (e)=>{
        setContactDate(e.target.value)
    }

    const handleStateCovidChange = (e)=> {
        setStateCovid(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(contactDate)
        console.log(stateCovid)
    }

    return  ( 
    <form className="form_close_contact" onSubmit={handleSubmit}>
        <div className="form_section">
            <label htmlFor="contact_date">
                Fecha de contacto
            </label>
            <input type="date" name="contact_date" onChange={handleDateChange} value={contactDate} required/>
        </div>
        <div className="form_section">
            <label htmlFor="state_covid">
                Estado covid actual: 
            </label>
            <select name="state_covid" value={stateCovid} onChange={handleStateCovidChange}>
                <option value="1">Positivo</option>
                <option value="2">Posible positivo</option>
            </select>
        </div>  
        <div className="form_section">

            <button className="submit-btn">
                Notificar a conocidos
            </button>
        </div>
    </form>    
    )
}

export default FormCloseContact

