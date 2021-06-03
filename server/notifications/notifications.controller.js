import bodyParser from 'body-parser';
import { Router } from 'express';
import Notification from './notification.model';
// import Protocol from '../protocols/protocol.model';
import { postDateEvents,eventsWhereParticiped,
         allParticipantIDFrom,
         notifyTo,
        //  filterPossibleCovidEvents,
        //  notifyEvent,
        //  startDateFromProtocol,
         createHealthCard} from '../helpers/apiHelpers';
import { notificationTypes } from '../config'

// new
const router = Router();

router.route('/close_contact').post(bodyParser.json(), async (request,response) => {
  try {

      // ubico a quienes tengo que notificar de mis conocidos 
      let dataToNotify = request.body
      let {notifier,date,notify_to} = dataToNotify      
      let eventsAfterContactDate = await postDateEvents(date)
      let eventsWhereTheNotifierParticiped = eventsWhereParticiped(eventsAfterContactDate,notifier)
      let allParticipants = allParticipantIDFrom(eventsWhereTheNotifierParticiped) 
      let know_close_contacts = notify_to.filter( notifier => allParticipants.includes(notifier))
      dataToNotify.type = notificationTypes[1]

      // notifico a know_close_contacts
      let notifications = await notifyTo(null,know_close_contacts,dataToNotify)
      return response.status(201).json(notifications);
  }
  catch (error) {
    console.log(error)
    return response.status(400).send(error);
  }
}
)


router.route('/').post(bodyParser.json(), async (request, response) => {
  try {
      let {notify_to} = request.body
    notifyTo(null,notify_to,request.body)
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

router.route('/notified/:id').patch(async (request, response) => {
  Notification.findByIdAndUpdate(
    {_id: request.params.id},
    {notified: true},
    {new: true},
    function(err, model) {
      if (err){
        return response.status(400).send(err);
      } else {
        return response.status(200).json(model);
      }
    });
});

router.route('/possible_covid/').post(bodyParser.json(), async (request, response) => {
  try {

    let data = request.body;
    data['type'] = 'Posible Positivo';
    let healthCard = await createHealthCard(data)
    return response.status(201).json(healthCard);

  } catch (error) {
    return response.status(400).send(error);
  }
});


export default router;