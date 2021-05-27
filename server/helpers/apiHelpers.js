import mongoose from 'mongoose';

import Event from '../events/event.model';
import Notification from '../notifications/notification.model';

exports.filterPossibleCovidEvents = async (notifier_id, date_from) => {
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

exports.notifyEvent = async (event, notifier, notifyData) => {
	var ids_to_notify = [event.organizer].concat(event.participants);
	var notificated = await Promise.all(ids_to_notify.map(async user => {
		if (user.toString() !== notifier) {
			notifyData.notify_to = [user];
			notifyData.event = event;
			const notification = new Notification(notifyData);
			let savedNotif = await notification.save();
			return savedNotif;
		}else {
			return null;
		}
	})
	)
	return notificated.filter(Boolean);
}
