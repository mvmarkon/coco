import bodyParser from 'body-parser';
import { Router } from 'express';
import Event from './event.model';
import Notification from '../notifications/notification.model';
import mongoose from 'mongoose';
const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    console.log('LLEGO POST EVENTO');
    console.log(JSON.stringify(request.body));
    const event = new Event(request.body);
    const savedEv = await event.save();
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
    const events = await Event.aggregate([
      { $match: { organizer: mongoose.Types.ObjectId(request.params.id) } },
      { $addFields: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } } }
    ]);
    return response.status(200).json(events);
  } catch (error) {
    return response.status(404).send(error);
  }
});

router.route('/').get(async (_, response) => {
  const events = await Event.aggregate([
    { $addFields: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } } }
  ]);
  return response.status(200).json(events);
});

export default router;
