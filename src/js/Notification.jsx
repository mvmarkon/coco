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

	const setAsSeen = (event) => {
		var dot = document.getElementById(event.target.id);
		if (! dot.hidden) {
			dot.hidden = true;
			dot = document.getElementById(- event.target.id);
			dot.hidden = false;
		}
		seeNotification(dot.getAttribute('notid'))
	}

	const seeNotification = (notid) => {
		fetch('api/notifications/notified/'+ notid, {method: 'PATCH'})
		.then(res => {
			console.log('Success:', res)
			return res.json()})
		.catch(error => console.error('Error:', error))
	}

	const isEvent = (type) => {
		return !(type === "Evento")
	}

	const cancelInvitation = (event) =>{
		var noti = JSON.parse(event.target.value)
		console.log(noti._id)
		var seen = event.target.name
		fetch('api/events/cancel_participation/' + noti.event, {
			method: 'PATCH',
			body: JSON.stringify({"cancelingId": localStorage.getItem('token')}),
			headers:{
				'Content-Type': 'application/json'
			  }
		})
		.then(res => {
			console.log('Success:', res)
			var dot = document.getElementById(seen);
			//efectos front
			if (! dot.hidden) {
				dot.hidden = true;
				seeNotification(noti._id)
				dot = document.getElementById(- seen);
				dot.hidden = false;
			}
			var div =document.getElementById(noti._id)
			debugger;
			div.hidden = true
			return res.json()})
		.catch(error => console.error('Error:', error))
	}

	const acceptInvitation = (event) =>{
		var noti = JSON.parse(event.target.value)
		var dot = document.getElementById(event.target.name);
		if (! dot.hidden) {
			dot.hidden = true;
			seeNotification(noti._id)
			dot = document.getElementById(- event.target.name);
			dot.hidden = false;
		}
	}

	return (
		<div className="contaimer">
			{notis.map((noti, index) => {
				return (
				<div key={index} noti={noti} className="card text-center">
					<div className="card-header">
						{noti.type}
						<div id= {index+1} className="spinner-grow spinner-grow-sm text-info" role="status" hidden= {noti.notified} notid={noti._id} onClick = {setAsSeen}>
  							<span className="visually-hidden">Loading...</span>
						</div>
						<div id= {- index-1} className="spinner-grow-stopped text-info" role="status" hidden= {! noti.notified} notid={noti._id} onClick = {setAsSeen}>
  							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
					<div className="card-body">
						<h5 className="card-title">{noti.notificationName}</h5>
						<p className="card-text">{noti.description}</p>
						<div hidden= {isEvent(noti.type)} id= {noti._id}>
							<button onClick = {cancelInvitation} value= {JSON.stringify(noti)} name={index+1} className="btn btn-warning">Rechazar</button>
							<button onClick = {acceptInvitation} value= {JSON.stringify(noti)} name={index+1} className="btn btn-success">Aceptar</button>
						</div>
					</div>
					<div className="card-footer text-muted">
						{noti.date}
					</div>
				</div>)
			})}
		</div>
	);
}

export default Notifications