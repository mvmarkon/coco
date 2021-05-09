import bodyParser from 'body-parser';
import { Router } from 'express';
import Protocol from './protocol.model';

const router = Router();

router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
    const protocol = new Protocol(request.body);
    const savedPro = await protocol.save();
    return response.status(200).json(savedPro);
  } catch (error) {
    return response.status(400).send(error);
  }
});
router.route('/').get(async (_, response) => {
  const protocols = await Protocol.find();
  return response.status(200).json(protocols);
});

export default router;