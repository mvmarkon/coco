import { defineFeature, loadFeature } from 'jest-cucumber'
import MongodbMemoryServer from 'mongodb-memory-server'
import mongoose from 'mongoose'
import app from '../../app'
import User from '../../users/user.model'
import Notification from '../../notifications/notification.model'
import request from 'supertest';
import { createNotification } from '../../helpers/apiHelpers'
import { notificationTypes } from '../../config'

let createNotificationTo = async (user) => {
    let notification = {
        description:"Hi",
        notify_to:user._id,
        type:notificationTypes[0],
        notifier:mongoose.Types.ObjectId('60967a887dcec85999f5ed1b'),
        date:new Date(),
        notificationName:'notification'
    }
    return await createNotification(notification)
}


const feature = loadFeature('server/atdd/notifications/getting_notifications.feature')

defineFeature(feature , (test) => {
    const db = new MongodbMemoryServer()

	beforeAll (async () => {
		const uri = await db.getConnectionString()
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		})
    })
            
	afterAll(async (done) => {
		await mongoose.disconnect(done)
		await db.stop()
	})

    afterEach(async () => {
		await User.remove({});
        await Notification.remove({})
	})

    test('Obtener notificaciones de un usuario', ({ given, when, then }) => {
        let user
        let response

        given('Existe un usuario y tiene una notificación', async () => {
            let userData = {
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com'
            }
            user = await User.create(userData)
            await createNotificationTo(user)
        })
    
         when('se envia una peticion GET api/notifications/:id', async () => {
	    	response = await request(app).get(`/api/notifications/${user._id}`)
        })
    
         then('se obtiene la notificacion',async () =>  {
          let notificationObtained = response.body[0]
          let notifiedUserId = JSON.stringify(response.body[0].notify_to)
          let userId = JSON.stringify(user._id)

          expect(notificationObtained.description).toBe("Hi")   
          expect(notifiedUserId).toBe(userId)   
		  expect(response.statusCode).toBe(200)

        })
    })
})