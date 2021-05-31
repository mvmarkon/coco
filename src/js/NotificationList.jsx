import React, { useEffect, useState } from 'react'
import '../css/Notification.css'
import Notification from './Notification'

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
			{notis.map((notif, index) => {
				debugger;
				return (
				<div key={index} className="card text-center">
					<Notification noti={notif} index = {index + 1}/>
				</div>)
			})}
		</div>
	);
}

export default Notifications