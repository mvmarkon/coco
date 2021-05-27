import eventModel from '../events/event.model'
import Notification from '../notifications/notification.model'
  
async function postDateEvents(contactDate) {
    let allEvents = await eventModel.find()
    let eventsAfterContactDate = await allEvents.filter(event => new Date(event.date).toISOString() > contactDate)
    return eventsAfterContactDate
  }

  function eventsWhereParticiped(events,userID) {
    return events.filter(event=>event.organizer == userID || event.participants.includes(userID))
  }

  function allParticipantIDFrom(events) {
    return events.map(
        event => [event.organizer].concat(event.participants)
        ).flat().map(a => a.toString())
  }

  async function notifyTo(event = null,usersIdToNotify,notifyData) {
    return await Promise.all(usersIdToNotify.map(async user => {
      if (user.toString() !== notifyData.notifier) {
        notifyData.notify_to = [user];
        notifyData.event = event
        const notification = new Notification(notifyData);
        let savedNotif = await notification.save();
        return notification;
      }else {
        return null;
      }
    })
    )
  }

export {postDateEvents,eventsWhereParticiped,allParticipantIDFrom,notifyTo} 