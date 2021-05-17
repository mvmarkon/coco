import bodyParser from 'body-parser';
import { Router } from 'express';
import Notification from './notification.model';

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

export default router;
