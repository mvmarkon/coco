import React,{useState} from 'react'
import '../../css/Cases/ReportCovid.css'

const NotifyReportCovid = () => {

    const [showOptions,setShowOptions] = useState(false)
    const [notifySuccess,setNotifySuccess] = useState(false)

    const handleShowOptions = () => {
        setShowOptions(true)
    }

    const handleClick = (e) => {
        e.preventDefault()
        var token = localStorage.getItem('token')
        fetch('api/healthCards/'+ e.target.value + '_result/' + token,{
            method: 'PATCH',
            headers: {'Content-type' : 'application/json'}    
        })
        .then(res=> { 
            if (res.status===201){
                setNotifySuccess(true)
            } else {
                console.log('Ocurrio un error el notificar, por favor intentelo mas tarde')
            }
        })               
    }
    
    return (
        <div className='report-covid-container'>
            {showOptions ?
                <div>
                    <button onClick={handleClick} disabled={notifySuccess} value="positive" className="btn btn-success">
                        Positivo
                    </button>
                    <button onClick={handleClick} disabled={notifySuccess} value="negative" className="btn btn-danger">
                        Negativo
                    </button>
                    {notifySuccess ? <p>Notificaciones enviadas</p> : null}
                </div>
                :
                <button onClick={handleShowOptions} className="btn btn-warning">
                    Notificar resultado de testeo
                </button>
            }
        </div>
       );

}

export default NotifyReportCovid