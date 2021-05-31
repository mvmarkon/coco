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
	var notificated = await notifyTo(event,ids_to_notify,notifyData)
	return notificated.filter(Boolean);
}

  
async function postDateEvents(contactDate) {
    let allEvents = await Event.find()
    let eventsAfterContactDate = await allEvents.filter(event => new Date(event.date).toISOString() > contactDate)
    return eventsAfterContactDate
  }

  function eventsWhereParticiped(events,userID) {
    return events.filter(event=>event.organizer.toString() === userID || event.participants.includes(userID))
  }

  function allParticipantIDFrom(events) {
    return events.map(
        event => [event.organizer].concat(event.participants)
        ).flat().map(a => a.toString())
  }

  async function notifyTo(event,usersIdToNotify,notifyData) {
    return await Promise.all(usersIdToNotify.map(async user => {
      if (user.toString() !== notifyData.notifier) {
        notifyData.notify_to = user;
        notifyData.event = event
        const notification = new Notification(notifyData);
        let savedNotif = await notification.save();
        return savedNotif;
      }else {
        return null;
      }
    })
    )
  }


export {postDateEvents,eventsWhereParticiped,allParticipantIDFrom,notifyTo} 
