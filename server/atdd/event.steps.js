import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import Event from '../events/event.model';
import User from '../users/user.model';
import Protocol from '../protocols/protocol.model';
import { defineFeature, loadFeature } from 'jest-cucumber';

const feature = loadFeature('./server/atdd/event.feature');

var savedUser;

defineFeature(feature, (test) => {
	const mongod = new MongodbMemoryServer();

	beforeAll(async () => {
		const uri = await mongod.getConnectionString();
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
			useFindAndModify: false
		});
	});

	afterAll(async (done) => {
		await mongoose.disconnect(done);
		await mongod.stop();
	});
	afterEach(async () => {
		await Event.remove({});
		await User.remove({});
	});

  test('Como cliente(app) quiero enviar una peticion POST y crear un evento para un usuario', ({ given, when, then }) => {
		given(/^Que existe el usuario "(.*)"$/, async (user) => {
			var userData = {
				name: user,
				nickName: user,
				age: 28,
				email: 'mail1@mail.com',
			}
			savedUser = await User.create(userData);
			const getResponse = await request(app).get('/api/users/' + savedUser._id);
			expect(getResponse.status).toBe(200);
			expect(JSON.stringify(getResponse.body._id)).toContain(savedUser._id);
		});

		when(/^Hago un POST al endpoint api\/events con horario desde:"(.*)" hasta:"(.*)", fecha:"(.*)" y lugar:"(.*)"$/, async (desde, hasta, fecha, lugar) => {
			var eventData = {
				eventName: 'evento atdd',
				date: fecha,
				hourFrom: desde,
				hourTo: hasta,
				place:lugar,
				organizer: savedUser._id,
				description: 'Evento ATDD',
			}
			const cerateEvent = await request(app).post('/api/events').send(eventData);
			expect(cerateEvent.status).toBe(200);
			expect(cerateEvent.body._id).toBeDefined();
		});

		then('Un evento para el usuario es creado', async() => {
			const getUserEvents = await request(app).get('/api/events/organizer/' + savedUser._id);
			expect(getUserEvents.status).toBe(200);
			expect(getUserEvents.body.length).toBe(1);
		});
  });
});