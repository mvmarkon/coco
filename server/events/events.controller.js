import bodyParser from 'body-parser';
import { Router } from 'express';
import Event from './event.model';

const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    const event = new Event(request.body);
    const savedEv = await event.save();
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
