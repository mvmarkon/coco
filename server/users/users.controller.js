import bodyParser from 'body-parser';
import { Router } from 'express';
import { Error } from 'mongoose';
import { notifyTo } from '../helpers/apiHelpers';
import User from './user.model';
import { notificationTypes } from '../config'


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
    const userbyid = await User.findById(request.params.id);
    return response.status(200).json(userbyid);
  } catch (iderror) {
    const userEmail = await User.findOne({email: request.params.id});
    if (userEmail) {
      return response.status(200).json(userEmail);
    } else {
      const nickName = await User.findOne({nickName: request.params.id});
      if(nickName) {
        return response.status(200).json(nickName);
      }
      return response.status(404).send('El usuario solicitado no se encuentra en la base de datos');
    }
  }
});


// solo agrega de a uno

router.route('/add_acquaintance_to/:id').put(bodyParser.json(), async (req,res) => {
  
  let { id } = req.params
  let { id_acquaintance_to_add } = req.body

  try {
      // si el usuario intenta agregarse a si mismo
      if (id === id_acquaintance_to_add) throw new Error('El usuario no puede agregarse a si mismo')
      // Si no lo tiene ya agregado , agrego el nuevo conocido al usuario
      let respuesta=  await User.findByIdAndUpdate(id,{ $addToSet: { 'acquaintances': id_acquaintance_to_add}},{useFindAndModify: false})
      // El usuario ya lo tiene como conocido
      if (respuesta.acquaintances.some(acquaintancesId=>acquaintancesId==id_acquaintance_to_add)) throw new Error('El usuario ya tiene este conocido')

      // notifico a usuario agregado
      let data_new_acquaintance = { notificationName:'Nuevo conocido',date:new Date(),notifier:id,notify_to:id_acquaintance_to_add,type:notificationTypes[6]}
      await notifyTo(null,[id_acquaintance_to_add],data_new_acquaintance)

      // envio de respuesta satifactorio
      res.status(200).send('El usuario tiene un nuevo conocido')
  }
  catch(error) {
    // envio de error
    res.status(400).send(error.message)
  }
})

router.route('/delete_known_to/:id').put(bodyParser.json(), async (req,res) => {
  
  let { id } = req.params
  let { id_acquaintance_to_remove } = req.body

  try { 
      // si el usuario intenta eliminarse a si mismo
      if (id === id_acquaintance_to_remove) throw new Error('El usuario no puede eliminarse a si mismo')
      
      // Si no lo tiene no lo elimina y manda un error sino lo elimina
      let respuesta=await User.findByIdAndUpdate(id,{ $pull: { 'acquaintances': id_acquaintance_to_remove}},{useFindAndModify: false})
      
      // El usuario no lo tiene para eliminar
       if (!respuesta.acquaintances.some(acquaintancesId=>acquaintancesId==id_acquaintance_to_remove)) throw new Error('El usuario no puede eliminar a alguien que no conoce')

      // notifico a usuario agregado
      let data_new_acquaintance = { notificationName:'Conocido eliminado',date:new Date(),notifier:id,notify_to:id_acquaintance_to_remove,type:notificationTypes[7]}
      await notifyTo(null,[id_acquaintance_to_remove],data_new_acquaintance)

      // envio de respuesta satifactorio
      res.status(200).send('El usuario a sido eliminado')
  }
  catch(error) {
    // envio de error
    res.status(400).send(error.message)
  }
})


export default router;
