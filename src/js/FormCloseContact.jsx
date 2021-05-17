import React, {useState} from 'react'
import '../css/FormCloseContact.css'


const FormCloseContact = () => {

    const [contactDate,setContactDate] = useState(new Date().toISOString())
    const [stateCovid,setStateCovid] = useState('1')
    const [notifySuccess,setNotifySuccess] = useState(false)


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
        fetch('api/users/acquaintances/60967a887dcec85999f5ed1d').then(
            res=> res.json()
        ).then(acquaintances=>
            fetch('api/notifications',{
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body:JSON.stringify({notify_to:acquaintances,notified:false,notificationName:'notify',date:new Date().toISOString(),description:'1',notifier:'60967a887dcec85999f5ed1d'})
            }).then(res=> res.status===201 ? setNotifySuccess(true) : setNotifySuccess(false))
            )
            
    }

    return  (
        <> 
    <form className="form_close_contact" onSubmit={handleSubmit}>
    <h3>Notificar contacto cercano</h3>

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

            <button className="submit-btn" disabled={notifySuccess}>
                Notificar a conocidos
            </button>
        </div>
        {notifySuccess ? <p>Notificacion exitosa</p> : null}
           
    </form>
    </> 
    )
}

export default FormCloseContact

