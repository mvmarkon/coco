import bodyParser from 'body-parser';
import { Router } from 'express';
import Notification from './notification.model';
import Protocol from '../protocols/protocol.model';
import Event from '../events/event.model';
import mongoose from 'mongoose';
import apiHelper from '../helpers/apiHelpers';

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
  var notifyData = request.body;
  try {
    var protocol = await Protocol.findOne({ active: true });
    var date_from = new Date(new Date(notifyData.date).setHours(0,0,0,0));
    date_from.setDate(date_from.getDate() - protocol.possibleCovidDays);

    let evts_target = await apiHelper.filterPossibleCovidEvents(notifyData.notifier, date_from);

    notifyData.type = 'Posible Positivo';
    var notifications = await Promise.all(evts_target.map(async evt => {
      return await apiHelper.notifyEvent(evt, notifyData.notifier, notifyData);
    }));
    return response.status(201).json(notifications.flat());
  } catch (error) {
    return response.status(400).send(error);
  }
});

export default router;
