import bodyParser from 'body-parser';
import { Router } from 'express';
import User from './user.model';

const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    const user = new User(request.body);
    await user.save();
    return response.status(200).json('User created!');
  } catch (error) {
    return response.status(400).send(error);
  }
});

router.route('/').get(async (_, response) => {
  const users = await User.find();
  return response.status(200).json(users);
});

router.route('/acquaintances/:id').get(async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    return response.status(200).json(user.acquaintances);
  } catch (error) {
    return response.status(404).send(error);
  }
});

router.route('/:id').get(async (request, response) => {
  try {
    const user = await User.findById(request.params.id);
    return response.status(200).json(user);
  } catch (error) {
    return response.status(404).send(error);
  }
});

export default router;
