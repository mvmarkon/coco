import bodyParser from 'body-parser';
import { Router } from 'express';
import Event from './event.model';
import Notification from '../notifications/notification.model';
import mongoose from 'mongoose';
import {notifyTo} from '../helpers/apiHelpers'
import {notificationTypes} from '../config'
const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    const event = new Event(request.body);
    const savedEv = await event.save();
    savedEv.participants.forEach(async (user_id) => {
      const notif = new Notification({
        notificationName: 'Notificacion de evento: ' + savedEv.eventName,
        type: 'Evento',
        date: savedEv.date,
        notifier: savedEv.organizer,
        notify_to: user_id,
        description: savedEv.description,
        event: mongoose.Types.ObjectId(event.id)
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

router.route('/attended/:id').get(async (request, response) => {
  const events = await Event.aggregate([
    {
      $match: {
        $or: [
          { organizer: mongoose.Types.ObjectId(request.params.id) },
          { participants: mongoose.Types.ObjectId(request.params.id) }
        ]
      }
    },
    { $addFields: { date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } } } }
  ]);
  return response.status(200).json(events);
});

router.route('/cancel_participation/:id').patch(bodyParser.json(), async (request, response) => {
  let cancelForId = request.body.cancelingId;
  try {
    var event = await Event.findById(request.params.id);

    var new_part = []
    event.participants.forEach(part => {
      if(part.toString() !== cancelForId) {
        new_part.push(part);
      }
    });
    const new_place = {
      name: event.place.name,
      numberParticipants: event.place.numberParticipants - 1
    }

    await Event.updateOne(
      {_id: request.params.id},
      {
        place: new_place,
        participants: new_part
      },
      {upsert: false}
    ).then( saved => {
      return response.status(200).json(saved);
    })
  } catch(error) {
    console.log(error);
    return response.status(400).send(error);
  }
});

router.delete('/cancel_event/:id',async (req,res)=>{
  const { id } = req.params
  const eventIdMoongoose = mongoose.Types.ObjectId(id)
  try {
    // eliminacion del evento
    let eventDeleted = await Event.findByIdAndDelete(eventIdMoongoose)
    // eliminacion de notificaciones de evento 
    await Notification.deleteMany({"event":eventIdMoongoose})
    let notification = {
      notificationName: `${eventDeleted.eventName} cancelado`,
      notifier:eventDeleted.organizer,
      type: notificationTypes[5],
      date: new Date(),
      description: eventDeleted.description
    }
    // notificacion a usuarios de eliminacion de evento
     await notifyTo(eventIdMoongoose,eventDeleted.participants,notification)
    // respuesta    
    res.status(200).send('Evento cancelado y usuarios notificados')
  }
  catch(error) {
    res.status(400).send(error)
  }
})

export default router;
