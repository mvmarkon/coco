import cron from 'node-cron';
import { cron_conf } from '../config';
import HealthCard from '../healthCards/healthCard.model';
import Notification from '../notifications/notification.model';

export async function processCard(card) {
	return await Promise.all(card.affectedUsers.map(async user => {
		let notifyData = {
			notificationName: 'Actualizacion de estado de ' + card.type,
			type: card.type,
			date: new Date(),
			description: JSON.stringify(card) + ' dias transcurridos: ' + card.daysPassed,
			notifier: card.sourceUser,
			notify_to: user
		}
		const notification = new Notification(notifyData);
		const savedNotif = await notification.save();
		return savedNotif;
	}));
}

export function followUpProcess() {
	cron.schedule(cron_conf, async () => {
		console.log('Procesando fichas de salud');
		// try {
		// 	const cards = await HealthCard.find({});
		// 	var processedCards = await Promise.all(await cards.map(async card => {
		// 		const pcard = await processCard(card);
		// 		return pcard;
		// 	}));
		// 	if (processedCards) {
		// 		console.log('Se procesaron exitosamente ' + processedCards.flat().length + ' fichas de salud');
		// 	}
		// } catch (error) {
		// 	console.log('Se produjo un error al procesar las fichas de salud. Detalles: ' + error);
		// }
	});
}

