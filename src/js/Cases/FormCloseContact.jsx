import React, {useState} from 'react'
import '../../css/Cases/FormCloseContact.css'
import '../../css/CoCo.css';


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
        fetch('api/users/known/'+ localStorage.getItem('token'))
        .then(res=> res.json())
        .then(known=>
            fetch('api/notifications/close_contact', {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    notify_to: known,
                    notified: false,
                    notificationName:'Contacto estrecho',
                    date: new Date().toISOString(),
                    description: stateCovid==="1" ? 'Positivo' : 'Posible positivo',
                    notifier: localStorage.getItem('token')
                })
            })
            .then(res=> { 
            if (res.status===201){setNotifySuccess(true)} 
            else {console.log('Ocurrio un error el notificar, por favor intentelo mas tarde')}
            })
        )
    }

    return(
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