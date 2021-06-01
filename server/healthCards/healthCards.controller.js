import { Router } from 'express';
import HealtCard from './healthCard.model';
const router = Router();

router.route('/').get(async (_, response) => {
  const healthCards = await HealtCard.find();
  return response.status(200).json(healthCards);
});

export default router;