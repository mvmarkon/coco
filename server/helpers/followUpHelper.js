import HealthCard from '../healthCards/healthCard.model';
import Notification from '../notifications/notification.model';
import Protocol from '../protocols/protocol.model';

export async function processCard(card) {
	const protocol = await Protocol.findOne({active: true});
	return await Promise.all(card.affectedUsers.map(async user => {
		var kill = false;
		var notiName = 'Actualizacion de estado de ' + card.type;
		var notiDesc = card.daysPassed;
		if(card.type === 'Contacto Estrecho' && card.daysPassed > protocol.quarantineContact ) {
			notiName = 'Finalizacion de estado de ' + card.type;
			notiDesc = 'Cuarentena cumplida, quedate en casa';
			kill = true;
		}

		if(card.type === 'Posible Positivo' && card.daysPassed > protocol.quarantineCovid) {
			notiName = 'Finalizacion de estado de ' + card.type;
			notiDesc = 'Cuarentena cumplida, quedate en casa';
			kill = true;
		}
		let notifyData = {
			notificationName: notiName,
			type: card.type,
			date: new Date(),
			description: notiDesc,
			notifier: card.sourceUser,
			notify_to: user
		}
		const notification = new Notification(notifyData);
		const savedNotif = await notification.save();
		if (kill) {
			try {
				const killed = await HealthCard.findOneAndRemove({_id: card._id})
			} catch(error) {
				console.log(error)
			}
		}
		console.log(kill)
		return notification;
	}));
}

export async function followUpProcess() {
	console.log('Procesando fichas de salud');
	try {
		const cards = await HealthCard.find({});
		var processedCards = await Promise.all(await cards.map(async card => {
			const pcard = await processCard(card);
			return pcard;
		}));
		if (processedCards) {
			console.log('Se procesaron exitosamente ' + cards.length + ' fichas de salud y se enviaron '+ processedCards.flat().length+' notificaciones');
		}
	} catch (error) {
		console.log('Se produjo un error al procesar las fichas de salud. Detalles: ' + error);
	}
}

