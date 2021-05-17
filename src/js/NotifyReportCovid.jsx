import React,{useState} from 'react'
import '../css/NotifyReportCovid.css'

const NotifyReportCovid = () => {


    const [showOptions,setShowOptions] = useState(false)
    const [notifySuccess,setNotifySuccess] = useState(false)


    const handleShowOptions = () => {
        setShowOptions(true)
    }

    const handleClick = (e) => {
            e.preventDefault()
            fetch('api/users/acquaintances/60967a887dcec85999f5ed1d').then(
                res=> res.json()
            ).then(acquaintances=>
                fetch('api/notifications',{
                    method: 'POST',
                    headers: {
                        'Content-type' : 'application/json'
                    },
                    body:JSON.stringify({notify_to:acquaintances,notified:false,notificationName:'notify',date:new Date().toISOString(),description:'1',notifier:'60967a887dcec85999f5ed1d'})
                }).then(res=> { 
                    if (res.status===201) 
                        {
                            setNotifySuccess(true)
                            console.log(`Notificacion enviada a los usuarios ${acquaintances}`)
                        } 
                    else 
                        {console.log('Ocurrio un error el notificar, por favor intentelo mas tarde')}
                })
                )
                
        }
    
    
    return (
        
        <div className='report-covid-container'>
        {showOptions ?
            <div>
                <button onClick={handleClick} disabled={notifySuccess} className="btn confirm-btn">
                    Positivo
                </button>
                <button onClick={handleClick} disabled={notifySuccess} className="btn negative-btn">
                    Negativo
                </button>
                {notifySuccess ? <p>Notificaciones enviadas</p> : null}
            </div>
            :
            <button onClick={handleShowOptions} className="btn">
                Notificar resultado de testeo
            </button>
        }
        </div>
       )
}

export default NotifyReportCovid