import mongoose from 'mongoose';
import Event from '../events/event.model';
import Notification from '../notifications/notification.model';
import Protocol from '../protocols/protocol.model';
import HealthCard from '../healthCards/healthCard.model';


async function startDateFromProtocol(date) {
	let protocol = await Protocol.findOne({ active: true });
	let date_from = new Date(new Date(date).setHours(0, 0, 0, 0));
	date_from.setDate(date_from.getDate() - protocol.possibleCovidDays);
	return date_from
}

async function filterPossibleCovidEvents(notifier_id, date_from) {
	let notif = mongoose.Types.ObjectId(notifier_id);

	const evs = await Event.aggregate([{
		$match: {
			$and: [
				{
					$or: [
						{ organizer: notif },
						{ participants: notif }
					]
				}, {
					date: {
						$gte: date_from,
						$lt: new Date()
					}
				}
			]
		}
	}]);
	return evs;
}

async function notifyEvent(event, notifyData) {
	var ids_to_notify = [event.organizer].concat(event.participants);
	var notificated = await notifyTo(event, ids_to_notify, notifyData);
	return notificated.filter(Boolean);
}

async function postDateEvents(contactDate) {
	let allEvents = await Event.find()
	let eventsAfterContactDate = await allEvents.filter(event => new Date(event.date).toISOString() > contactDate)
	return eventsAfterContactDate
}

function eventsWhereParticiped(events, userID) {
	return events.filter(event => event.organizer.toString() === userID || event.participants.includes(userID))
}

function allParticipantIDFrom(events) {
	return events.map(
		event => [event.organizer].concat(event.participants)
	).flat().map(a => a.toString())
}

async function notifyTo(event, usersIdToNotify, notifyData) {
	return await Promise.all(usersIdToNotify.map(async user => {
		if (user.toString() !== notifyData.notifier) {
			notifyData.notify_to = user;
			notifyData.event = event
			const notification = new Notification(notifyData);
			const savedNotif = await notification.save();
			return savedNotif;
		} else {
			return null;
		}
	})
	)
}

async function createHealthCard(data) {
	let date_from = await startDateFromProtocol(data.date)
	let evts_target = await filterPossibleCovidEvents(data.notifier, date_from);

	var notifications = await Promise.all(await evts_target.map(async evt => {
		return await notifyEvent(await evt, data);
	}));
	let flattened = await Promise.all(await notifications.flat().map(notif => { return notif.notify_to.toString() }));
	let affected = Array.from(new Set(flattened))
	var healthData = {
		type: data.type,
		sourceUser: data.notifier,
		startDate: data.date,
		affectedUsers: affected
	}
	const healthCard = new HealthCard(healthData);
	const saved = await healthCard.save();
	return saved;
}

export { postDateEvents, eventsWhereParticiped, allParticipantIDFrom, notifyTo, createHealthCard, startDateFromProtocol } 
