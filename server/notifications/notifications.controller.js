import bodyParser from 'body-parser';
import { Router } from 'express';
import Notification from './notification.model';
import Protocol from '../protocols/protocol.model';
import Event from '../events/event.model';
import mongoose from 'mongoose';

const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    request.body.notify_to.forEach(async user => {
      let notifyData = request.body;
      notifyData.notify_to = [user]
      const notification = new Notification(notifyData);
      const savedNotif = await notification.save();
    });
    return response.status(201).json('OK');
  } catch (error) {
    return response.status(400).send(error);
  }
});

router.route('/:id').get(async (request, response) => {
	try {
    const notifications = await Notification.find({ notify_to: request.params.id});
    return response.status(200).json(notifications);
  } catch (error) {
    return response.status(404).send(error);
  }
});

router.route('/').get(async (_, response) => {
  const notifications = await Notification.find();
  return response.status(200).json(notifications);
});

router.route('/possible_covid/').post(bodyParser.json(), async (request, response) => {
  try {
    var protocol = await Protocol.findOne({ active: true });
    var date_from = new Date(new Date(request.body.date).setHours(0,0,0,0));
    var notifier_id = mongoose.Types.ObjectId(request.body.notifier);
    date_from.setDate(date_from.getDate() - protocol.possibleCovidDays);
    const evts_target = await Event.aggregate([{
      $match: {
        $and: [
          {
            $or: [
              { organizer: notifier_id },
              { participants: notifier_id }
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

    var evts = evts_target.slice()
    async function processEvents(evts) = {
      
    }
    try {
      await Promise.all(evts.map(async evt => {
        console.log(evt);
        let target_usrs = evt.participants.slice();
        target_usrs.push(evt.organizer)
        target_usrs.map( async user => {
          console.log(user)
          if(user !== request.body.notifier) {
            let notifyData = request.body;
            notifyData.notify_to = [user]
            const notification = new Notification(notifyData);
            const savedNotif = await notification.save();
          }
        });
      }));
    } catch(err) {
      console.log(err);
    }
    console.log(evts_target);
    return response.status(201).json('OK');
  } catch (error) {
    console.log(error);
    return response.status(400).send(error);
  }
});

export default router;
