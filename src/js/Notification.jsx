import React, { useEffect, useState } from 'react'
import '../css/Notification.css'

const Notifications = () => {
    const [notis,setNotis]= useState([])

	useEffect(() => {
        const fetchNotis = async () => {
			const notifs = await fetch('/api/notifications/'+ localStorage.getItem('token'))
			.then(res => res.json())
            const users = await fetch("api/users").then(res =>res.json())
			const nots = notifs.map(not=>{
				const notifier = users.find(user=>not.notifier === user._id).nickName
				return{...not, notifier}
			})
			//.catch(error => this.setState({ error: '??' }));
        	setNotis(nots)                            
        }
        fetchNotis()
    }, [setNotis])

	return (
		<div className="contaimer">
			{notis.map((noti, index) => {
				return (
				<div key={index} class="card text-center">
					<div class="card-header">
						{noti.type}
					</div>
					<div class="card-body">
						<h5 class="card-title">{noti.notificationName}</h5>
						<p class="card-text">{noti.description}</p>
						<IsEvent type = {noti.type}/>
					</div>
					<div class="card-footer text-muted">
						{noti.date}
					</div>
				</div>)
			})}
		</div>
	);
}

const IsEvent = (type) => {
	if (type == 'Evento'){
		return(<>
			<a href="#" class="btn btn-primary">Aceptar</a>
			<a href="#" class="btn btn-primary">Rechazar</a>
		</>
		)
	}
}

export default Notifications