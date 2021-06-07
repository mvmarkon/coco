import { defineFeature, loadFeature } from 'jest-cucumber'
import MongodbMemoryServer from 'mongodb-memory-server'
import app from '../app'
import mongoose from 'mongoose'
import User from '../users/user.model'
import Notification from '../notifications/notification.model'
import request from 'supertest';


const feature = loadFeature('./server/atdd/add_acquaintance.feature')

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

    test('Agregando un usuario que no tengo como conocido', ({ given, when,and, then }) => {
        let acquaintance
        let numberOfAcquaintancesBeforeAddAcquaintance
        let numberOfAcquaintancesAfterAddAcquaintance 
        let user
        let response
        let numberOfNotificationsBeforeAddAcquaintance  
        let numberOfNotificationsAfterAddAcquaintance

        given('Tengo un usuario', async () => {
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                acquaintances:[]
            }).save()
            numberOfAcquaintancesBeforeAddAcquaintance = user.acquaintances.length
        })
          
        and('Tengo un usuario al que quiero agregar como conocido que no tiene ninguna notificacion', async () => {
            acquaintance = await new User({
                name: 'conocido',
                nickName: 'usuario2',
                age: 28,
                email: 'conocido@mail.com',
                acquaintances:[]
            }).save()
            let req1 = await request(app).get(`/api/notifications/${acquaintance._id}`)

            numberOfNotificationsBeforeAddAcquaintance = req1.body.length
        })
    
        when('Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar', async () => {
    		response = await request(app).put(`/api/users/add_acquaintance_to/${user._id}`).send({id_acquaintance_to_add:acquaintance._id})
        })
    
        then('El usuario se agrega a mis conocidos y recibe una notificacion',async () =>  {
		    let res = await request(app).get(`/api/users/${user._id}`)
            let res2 = await request(app).get(`/api/users/${acquaintance._id}`)
            let { acquaintances } = res.body
            let { _id } = res2.body 
            numberOfAcquaintancesAfterAddAcquaintance = acquaintances.length
             let req2 = await request(app).get(`/api/notifications/${acquaintance._id}`)
             numberOfNotificationsAfterAddAcquaintance = req2.body.length    
          expect(numberOfAcquaintancesAfterAddAcquaintance).toBe(numberOfAcquaintancesBeforeAddAcquaintance+1)
          expect(numberOfNotificationsAfterAddAcquaintance).toBe(numberOfNotificationsBeforeAddAcquaintance+1)
          expect(acquaintances[0]).toBe(_id)
          expect(response.statusCode).toBe(200)
          expect(response.text).toBe("El usuario tiene un nuevo conocido")

        })
    })
    
    test('Agregando un usuario que ya tengo como conocido', ({ given, when,and, then }) => {
        let acquaintance
        let numberOfAcquaintances = 0
        let user
        let res

        given('Tengo un usuario al que quiero agregar como conocido', async () => {
            acquaintance = await new User({
                name: 'conocido',
                nickName: 'usuario2',
                age: 24,
                email: 'conocido@mail.com',
                acquaintances:[]
            }).save()    
        })

        and('Tengo un usuario que ya conoce al usuario que quiero agregar como conocido', async () => {
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                acquaintances:[acquaintance._id]
            }).save()
            numberOfAcquaintances = user.acquaintances.length
        })

        when('Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar', async () => {
	    	res = await request(app).put(`/api/users/add_acquaintance_to/${user._id}`).send({id_acquaintance_to_add:acquaintance._id})
        })
    
        then('Recibo un error del servidor',async () => {
		    let myUser = await request(app).get(`/api/users/${user._id}`)
            let acquaintanceOfMyUser = await request(app).get(`/api/users/${acquaintance._id}`)
            let { acquaintances } = myUser.body
            let { _id } = acquaintanceOfMyUser.body 
            numberOfAcquaintances = acquaintances.length
          expect(numberOfAcquaintances).toBe(1)
          expect(acquaintances[0]).toBe(_id)
          expect(res.statusCode).toBe(400)        
          expect(res.text).toBe('El usuario ya tiene este conocido')        

        })
    })   
})