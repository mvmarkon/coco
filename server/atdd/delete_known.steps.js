import { defineFeature, loadFeature } from 'jest-cucumber'
import MongodbMemoryServer from 'mongodb-memory-server'
import app from '../app'
import mongoose from 'mongoose'
import User from '../users/user.model'
import request from 'supertest';

const feature = loadFeature('./server/atdd/delete_known.feature')

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
        	})

    test('Eliminando un usuario que tengo como conocido', ({ given, when,and, then }) => {
        let known
        let numberOfKnownBeforeDeleteKnown
        let numberOfKnownAfterDeleteKnown 
        let user
        let response  

        given('Dado un usuario que tiene a otro usuario como conocido', async () => {
            known = await new User({
                name: 'conocido',
                nickName: 'conocido1',
                age: 28,
                email: 'conocido@mail.com',
                known:[]
            }).save()
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                known:[known]
            }).save()

            numberOfKnownBeforeDeleteKnown = user.known.length
        })
    
        when('Envio una peticion PUT al endpoint api/users/delete_known_to con el id del usuario que quiero eliminar', async () => {
    		response = await request(app).put(`/api/users/delete_known_to/${user._id}`).send({id_known_to_remove:known._id})
        })
    
        then('El usuario elimina al conocido',async () => {
		    let res = await request(app).get(`/api/users/${user._id}`)
            let { known } = res.body

        numberOfKnownAfterDeleteKnown = known.length
          expect(numberOfKnownAfterDeleteKnown).toBe(numberOfKnownBeforeDeleteKnown-1)
          expect(response.statusCode).toBe(200)
          expect(response.text).toBe("El usuario a sido eliminado")
        })

    })        
    

    test('Eliminando un usuario que no tengo como conocido', ({ given, when,and, then }) => {
        let known
        let numberOfKnownBeforeDeleteKnown
        let numberOfKnownAfterDeleteKnown 
        let user
        let response  

        given('Tengo un usuario sin conocidos', async () => {
            known = await new User({
                name: 'conocido',
                nickName: 'conocido1',
                age: 28,
                email: 'conocido@mail.com',
                known:[]
            }).save()
            user = await new User({
                name: 'usuario',
                nickName: 'usuario1',
                age: 28,
                email: 'usuario@mail.com',
                known:[]
            }).save()

            numberOfKnownBeforeDeleteKnown = user.known.length
        })
    
        when('Envio una peticion PUT al endpoint api/users/delete_known_to con el id del usuario que quiero eliminar', async () => {
    		response = await request(app).put(`/api/users/delete_known_to/${user._id}`).send({id_known_to_remove:known._id})
        })
    
        then('El usuario recibe un error del servidor',async () => {
		    let res = await request(app).get(`/api/users/${user._id}`)
            let { known } = res.body

        numberOfKnownAfterDeleteKnown = known.length
          expect(numberOfKnownAfterDeleteKnown).toBe(numberOfKnownBeforeDeleteKnown)
          expect(response.statusCode).toBe(400)
          expect(response.text).toBe("El usuario no puede eliminar a alguien que no conoce")})
    })
})