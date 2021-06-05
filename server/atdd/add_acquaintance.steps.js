import { defineFeature, loadFeature } from 'jest-cucumber'
import MongodbMemoryServer from 'mongodb-memory-server'
import app from '../app'
import mongoose from 'mongoose'
import User from '../users/user.model'
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

    // afterEach(async () => {
	// 	await User.remove({});
	// })

    test('Agregando un usuario que no tengo como conocido', ({ given, when,and, then }) => {
        let acquaintance
        let numberOfAcquaintances = 0
        let user

        given('Tengo un usuario', async () => {
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                acquaintances:[]
            }).save()
            acquaintance = user.acquaintances.length
            
        })
          
        and('Tengo un usuario al que quiero agregar como conocido', async () => {
            acquaintance = await new User({
                name: 'conocido',
                nickName: 'usuario2',
                age: 28,
                email: 'conocido@mail.com',
                acquaintances:[]
            }).save()
        })
    
        when('Envio una peticion PUT al endpoint api/users/add_acquaintance_to con el id del usuario que quiero agregar', async () => {
		    await request(app).put(`/api/users/add_acquaintance_to/${user._id}`).send({id_acquaintance_to_add:acquaintance._id})
        })
    
        then('El usuario se agrega a mis conocidos',async () => {
		    let res = await request(app).get(`/api/users/${user._id}`)
            let res2 = await request(app).get(`/api/users/${acquaintance._id}`)
            let { acquaintances } = res.body
            let { _id } = res2.body 
            numberOfAcquaintances = acquaintances.length
            console.log(numberOfAcquaintances)
          expect(numberOfAcquaintances).toBe(1)
          expect(acquaintances[0]).toBe(_id)

        })
    })   
})