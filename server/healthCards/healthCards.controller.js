import { Router } from 'express';
import HealthCard from './healthCard.model';
import {notifyTo} from '../helpers/apiHelpers';

const router = Router();

router.route('/').get(async (_, response) => {
  const healthCards = await HealthCard.find();
  return response.status(200).json(healthCards);
});

router.route('/negative_result/:id').patch(async (request, response) => {
  try {
    const hc = await HealthCard.findOne({
      sourceUser: request.params.id,
      type: 'Posible Positivo'
    });
    let ndata = {
      notificationName: 'El resultado del posible covid fue negativo',
      type: hc.type,
      date: new Date(),
      description: 'Ya sabes',
      notifier: hc.sourceUser
    }
    const notis = await notifyTo(null, hc.affectedUsers, ndata);
    const killed = await HealthCard.findOneAndRemove({_id: hc._id})
    return response.status(200).json('OK');
  } catch(error){
    console.log(error);
    return  response.status(400).json(error);
  }

});

router.route('/positive_result/:id').patch(async (request, response) => {
  try {
    const hc = await HealthCard.findOne(
      {sourceUser: request.params.id,
      type: 'Posible Positivo'});
    let ndata = {
      notificationName: 'El resultado del posible covid fue positivo',
      type: hc.type,
      date: new Date(),
      description: 'Guardate papu',
      notifier: hc.sourceUser
    }
    const notis = await notifyTo(null, hc.affectedUsers, ndata);
    return response.status(200).json('OK');
  } catch(error){
    console.log(error);
    return  response.status(400).json(error);
  }
});
export default router;