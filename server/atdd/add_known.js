import { defineFeature, loadFeature } from 'jest-cucumber'
import MongodbMemoryServer from 'mongodb-memory-server'
import app from '../app'
import mongoose from 'mongoose'
import User from '../users/user.model'
import Notification from '../notifications/notification.model'
import request from 'supertest';


const feature = loadFeature('./server/atdd/add_known.feature')

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
        let known
        let numberOfKnownBeforeAddKnown
        let numberOfKnownAfterAddKnown 
        let user
        let response
        let numberOfNotificationsBeforeAddKnown  
        let numberOfNotificationsAfterAddKnown

        given('Tengo un usuario', async () => {
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                known:[]
            }).save()
            numberOfKnownBeforeAddKnown = user.known.length
        })
          
        and('Tengo un usuario al que quiero agregar como conocido que no tiene ninguna notificacion', async () => {
            known = await new User({
                name: 'conocido',
                nickName: 'usuario2',
                age: 28,
                email: 'conocido@mail.com',
                known:[]
            }).save()
            let req1 = await request(app).get(`/api/notifications/${known._id}`)

            numberOfNotificationsBeforeAddKnown = req1.body.length
        })
    
        when('Envio una peticion PUT al endpoint api/users/add_known_to con el id del usuario que quiero agregar', async () => {
    		response = await request(app).put(`/api/users/add_known_to/${user._id}`).send({id_known_to_add:known._id})
        })
    
        then('El usuario se agrega a mis conocidos y recibe una notificacion',async () =>  {
		    let res = await request(app).get(`/api/users/${user._id}`)
            let res2 = await request(app).get(`/api/users/${known._id}`)
            let { known } = res.body
            let { _id } = res2.body 
            numberOfKnownAfterAddKnown = known.length
             let req2 = await request(app).get(`/api/notifications/${known._id}`)
             numberOfNotificationsAfterAddKnown = req2.body.length    
          expect(numberOfKnownAfterAddKnown).toBe(numberOfKnownBeforeAddKnown+1)
          expect(numberOfNotificationsAfterAddKnown).toBe(numberOfNotificationsBeforeAddKnown+1)
          expect(known[0]).toBe(_id)
          expect(response.statusCode).toBe(200)
          expect(response.text).toBe("El usuario tiene un nuevo conocido")

        })
    })
    
    test('Agregando un usuario que ya tengo como conocido', ({ given, when,and, then }) => {
        let known
        let numberOfKnown = 0
        let user
        let res

        given('Tengo un usuario al que quiero agregar como conocido', async () => {
            known = await new User({
                name: 'conocido',
                nickName: 'usuario2',
                age: 24,
                email: 'conocido@mail.com',
                known:[]
            }).save()    
        })

        and('Tengo un usuario que ya conoce al usuario que quiero agregar como conocido', async () => {
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                known:[known._id]
            }).save()
            numberOfKnown = user.known.length
        })

        when('Envio una peticion PUT al endpoint api/users/add_known_to con el id del usuario que quiero agregar', async () => {
	    	res = await request(app).put(`/api/users/add_known_to/${user._id}`).send({id_known_to_add:known._id})
        })
    
        then('Recibo un error del servidor',async () => {
		    let myUser = await request(app).get(`/api/users/${user._id}`)
            let knownOfMyUser = await request(app).get(`/api/users/${known._id}`)
            let { known } = myUser.body
            let { _id } = knownOfMyUser.body 
            numberOfKnown = known.length
          expect(numberOfKnown).toBe(1)
          expect(known[0]).toBe(_id)
          expect(res.statusCode).toBe(400)        
          expect(res.text).toBe('El usuario ya tiene este conocido')        

        })
    })   
})