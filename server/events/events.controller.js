import bodyParser from 'body-parser';
import { Router } from 'express';
import Event from './event.model';
import Notification from '../notifications/notification.model';

const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    const event = new Event(request.body);
    const savedEv = await event.save();
    // savedEv.date = JSON.stringify(savedEv.date).split('T')[0]
    savedEv.participants.forEach(async (user_id) => {
      const notif = new Notification({
        notificationName: 'Notificacion de evento: ' + savedEv.eventName,
        date: savedEv.date,
        notifier: savedEv.organizer,
        notify_to: [user_id]
      });
      const savedNotif = await notif.save();
    });
    return response.status(200).json(savedEv);
  } catch (error) {
    return response.status(400).send(error);
  }
});

router.route('/organizer/:id').get(async (request, response) => {
  try {
    const events = await Event.find({ organizer: request.params.id });
    return response.status(200).json(events);
  } catch (error) {
    return response.status(404).send(error);
  }
});

router.route('/').get(async (_, response) => {
  const events = await Event.find();
  return response.status(200).json(events);
});

export default router;
